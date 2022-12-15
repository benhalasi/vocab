package bh.sp.vocab.core.api.vocab.item;

import javax.validation.constraints.NotNull;

import bh.sp.vocab.core.api.beans.ResponseBean;
import bh.sp.vocab.core.model.vocab.item.VocabItemEntity;
import bh.sp.vocab.core.model.vocab.item.Word;
import bh.sp.vocab.core.model.vocab.item.event.VocabItemEventEntity;
import lombok.Data;

@Data
public class VocabItem implements ResponseBean {

  public VocabItem(VocabItemEntity vocabItem) {
    id = vocabItem.id;
    known = vocabItem.getKnown();
    learnt = vocabItem.getLearnt();
    confidence = vocabItem.getOptionalLastEvent().map(le -> le.getConfidenceSnapshot()).orElse(0d);
    lastDirectEvent = vocabItem.getOptionalLastEvent().orElse(null);
  }

  @NotNull
  private long id;

  @NotNull
  private Word known;

  @NotNull
  private Word learnt;

  @NotNull
  private double confidence;

  private VocabItemEventEntity lastDirectEvent;

}
