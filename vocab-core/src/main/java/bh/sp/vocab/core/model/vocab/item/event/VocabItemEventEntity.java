package bh.sp.vocab.core.model.vocab.item.event;

import java.sql.Timestamp;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.fasterxml.jackson.annotation.JsonIgnore;

import bh.sp.vocab.core.model.vocab.item.VocabItemEntity;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity(name = VocabItemEventEntity.TABLE_NAME)
public class VocabItemEventEntity extends PanacheEntity {

  public static final String TABLE_NAME = "vocabitemevent";

  private static final int CONFIDENCE_PRECISION = (int) Math.pow(10, 5);

  public static final String OWNER_JOIN_COLUMN_NAME = "vocabitem_id";

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = OWNER_JOIN_COLUMN_NAME, nullable = false, updatable = false)
  @JsonIgnore
  private VocabItemEntity vocabItem;

  @Builder.Default
  private Timestamp ts = new Timestamp(System.currentTimeMillis());
  private boolean success;
  private boolean direct;
  private Type type;
  private double confidenceSnapshot;

  public static enum Type {
    MANUAL_FEEDBACK,
    Q_CHOICE_4,
    Q_CHOICE_4_BAD_ALT,
    Q_FREE_TEXT
  }

  @PrePersist
  @PreUpdate
  private void prePresistAndUpdate() {
    confidenceSnapshot = ((double) Math.round(confidenceSnapshot * CONFIDENCE_PRECISION)) / CONFIDENCE_PRECISION;
  }
}
