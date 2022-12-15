package bh.sp.vocab.core.model.vocab;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonIgnore;

import bh.sp.vocab.core.model.user.UserEntity;
import bh.sp.vocab.core.model.vocab.item.VocabItemEntity;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import io.quarkus.runtime.annotations.IgnoreProperty;
import io.smallrye.common.constraint.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.Singular;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity(name = VocabSetEntity.TABLE_NAME)
public class VocabSetEntity extends PanacheEntity {

  public static final String TABLE_NAME = "vocabset";

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "user_id", nullable = false, updatable = false)
  @IgnoreProperty
  private UserEntity user;

  @ManyToOne(fetch = FetchType.LAZY, optional = true)
  @JoinColumn(updatable = false)
  @JsonIgnore
  private VocabSetEntity basis;

  @Builder.Default
  @Enumerated(EnumType.STRING)
  @NotNull
  private VocabSetState state = VocabSetState.ENABLED;

  @Enumerated(EnumType.STRING)
  @NotNull
  private Language known;

  @Enumerated(EnumType.STRING)
  @NotNull
  private Language learnt;

  @Singular
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "vocabSet", orphanRemoval = true)
  private final List<VocabItemEntity> words = new ArrayList<>();

}
