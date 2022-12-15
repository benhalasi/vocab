package bh.sp.vocab.core.api.vocab.item;

import javax.validation.constraints.NotNull;

import bh.sp.vocab.core.api.beans.PostBean;
import bh.sp.vocab.core.api.beans.UpdateBean;
import bh.sp.vocab.core.model.vocab.item.Word;
import lombok.Data;

@Data
public class VocabItemPayload implements PostBean, UpdateBean {

  @NotNull
  private Word known;

  @NotNull
  private Word learnt;

}
