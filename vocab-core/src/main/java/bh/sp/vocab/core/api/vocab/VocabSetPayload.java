package bh.sp.vocab.core.api.vocab;

import javax.validation.constraints.NotNull;

import bh.sp.vocab.core.api.beans.PostBean;
import bh.sp.vocab.core.api.beans.UpdateBean;
import bh.sp.vocab.core.model.vocab.Language;
import bh.sp.vocab.core.model.vocab.VocabSetState;
import lombok.Data;

@Data
public class VocabSetPayload implements PostBean, UpdateBean {

  @NotNull
  private Language known;

  @NotNull
  private Language learnt;

  @NotNull
  private VocabSetState state;

}
