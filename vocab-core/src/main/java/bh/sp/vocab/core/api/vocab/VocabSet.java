package bh.sp.vocab.core.api.vocab;

import javax.validation.constraints.NotNull;

import bh.sp.vocab.core.api.beans.ResponseBean;
import bh.sp.vocab.core.model.vocab.Language;
import bh.sp.vocab.core.model.vocab.VocabSetState;
import bh.sp.vocab.core.model.vocab.VocabSetEntity;
import lombok.Data;

@Data
public class VocabSet implements ResponseBean {

  public VocabSet(VocabSetEntity vocabSet) {
    id = vocabSet.id;
    state = vocabSet.getState();
    known = vocabSet.getKnown();
    learnt = vocabSet.getLearnt();
  }

  @NotNull
  private long id;

  @NotNull
  private boolean upToDate = true;

  @NotNull
  private VocabSetState state = VocabSetState.ENABLED;

  @NotNull
  private Language known;

  @NotNull
  private Language learnt;

}
