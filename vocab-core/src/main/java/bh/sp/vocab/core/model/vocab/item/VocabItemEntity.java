package bh.sp.vocab.core.model.vocab.item;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiFunction;
import java.util.stream.Collectors;

import javax.persistence.AttributeOverride;
import javax.persistence.AttributeOverrides;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.JoinFormula;

import com.fasterxml.jackson.annotation.JsonIgnore;

import bh.sp.vocab.core.model.vocab.VocabSetEntity;
import bh.sp.vocab.core.model.vocab.item.event.VocabItemEventEntity;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import io.quarkus.logging.Log;
import io.smallrye.mutiny.Uni;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Singular;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity(name = VocabItemEntity.TABLE_NAME)
public class VocabItemEntity extends PanacheEntity {

  public static final String TABLE_NAME = "vocabitem";

  public static final String VOCABSET_COLUMN = "vocabset_id";

  private static final Timestamp TIMESTAMP_0 = new Timestamp(0);

  private static final Comparator<VocabItemEntity> WEAKEST = sorter(
      (i0, i1) -> {
        double cfs1 = i1.getOptionalLastEvent().map(VocabItemEventEntity::getConfidenceSnapshot).orElse(0d);
        double cfs0 = i0.getOptionalLastEvent().map(VocabItemEventEntity::getConfidenceSnapshot).orElse(0d);
        return cfs0 - cfs1;
      });

  private static final Comparator<VocabItemEntity> OLDEST = sorter(
      (i0, i1) -> {
        Timestamp ts1 = i1.getOptionalLastEvent().map(VocabItemEventEntity::getTs).orElse(TIMESTAMP_0);
        Timestamp ts0 = i0.getOptionalLastEvent().map(VocabItemEventEntity::getTs).orElse(TIMESTAMP_0);
        return ts0.compareTo(ts1);
      });

  private static final Comparator<VocabItemEntity> NEWEST = sorter(
      (i0, i1) -> {
        Timestamp ts1 = i1.getOptionalLastEvent().map(VocabItemEventEntity::getTs).orElse(TIMESTAMP_0);
        Timestamp ts0 = i0.getOptionalLastEvent().map(VocabItemEventEntity::getTs).orElse(TIMESTAMP_0);
        return ts1.compareTo(ts0);
      });

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = VOCABSET_COLUMN, nullable = false, updatable = false)
  private VocabSetEntity vocabSet;

  @AttributeOverrides({
      @AttributeOverride(name = "word", column = @Column(name = "known_word")),
      @AttributeOverride(name = "bracketInfo", column = @Column(name = "known_bracketInfo"))
  })
  @NotNull
  private Word known;

  @AttributeOverrides({
      @AttributeOverride(name = "word", column = @Column(name = "learnt_word")),
      @AttributeOverride(name = "bracketInfo", column = @Column(name = "learnt_bracketInfo"))
  })
  @NotNull
  private Word learnt;

  @Setter(AccessLevel.NONE)
  @Getter(onMethod = @__({ @Deprecated }))
  @ManyToOne
  @JoinFormula("(SELECT e.id FROM " + VocabItemEventEntity.TABLE_NAME + " e WHERE e."
      + VocabItemEventEntity.OWNER_JOIN_COLUMN_NAME
      + " = id ORDER BY e.ts DESC LIMIT 1)")
  private VocabItemEventEntity lastEvent;

  @JsonIgnore
  public Optional<VocabItemEventEntity> getOptionalLastEvent() {
    return Optional.ofNullable(lastEvent);
  }

  @OneToMany(cascade = CascadeType.ALL, mappedBy = "vocabItem", orphanRemoval = true)
  @Singular
  @NotNull
  private final List<VocabItemEventEntity> events = new ArrayList<>();

  public static Uni<List<VocabItemEntity>> find(
      Set<VocabSetEntity> vss,
      Mode mode,
      int limit) {

    Log.info(vss.size());

    String vocabSetIsExpected = vss.stream()
        .map(vs -> VOCABSET_COLUMN + "=" + vs.id)
        .collect(Collectors.joining(" or ", "(", ")"));

    return VocabItemEntity
        .find("from " + VocabItemEntity.TABLE_NAME + " where " + vocabSetIsExpected)
        // TODO: sort on db side
        // .page(0, limit)
        .stream()
        .onItem().castTo(VocabItemEntity.class)
        .collect().asList()
        .map(words -> {
          Log.info(words.size());
          final Set<Word> learntWords = new HashSet<>();
          final Set<Word> knownWords = new HashSet<>();
          return words.stream()
              .sorted(getAdaquateSorter(mode))
              .filter(item -> {
                return learntWords.add(item.getLearnt()) && knownWords.add(item.getKnown());
              })
              .limit(limit)
              .collect(Collectors.toList());
        });
  }

  public static enum Mode {
    OLD_WORDS, NEW_WORDS, WEAK_WORDS
  }

  private static Comparator<VocabItemEntity> getAdaquateSorter(Mode mode) {
    switch (mode) {
      case OLD_WORDS:
        return OLDEST;
      case WEAK_WORDS:
        return WEAKEST;
      case NEW_WORDS:
        return NEWEST;
      default:
        Log.warnf("unhandled mode %s", mode);
        return WEAKEST;

    }
  }

  private static Comparator<VocabItemEntity> sorter(BiFunction<VocabItemEntity, VocabItemEntity, Number> sorter) {
    return new Comparator<VocabItemEntity>() {
      @Override
      public int compare(VocabItemEntity i0, VocabItemEntity i1) {
        return (int) Math.signum(sorter.apply(i0, i1).doubleValue());
      }
    };
  }

  public static VocabItemEntity of(String known, String learnt) {
    VocabItemEntity vocabItem = new VocabItemEntity();
    vocabItem.known = Word.of(known);
    vocabItem.learnt = Word.of(learnt);
    return vocabItem;
  }
}
