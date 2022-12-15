package bh.sp.vocab.core.api.user;

import javax.validation.constraints.NotBlank;

import bh.sp.vocab.core.api.beans.PostBean;
import lombok.Data;

@Data
public class UserPost implements PostBean {

  @NotBlank
  private String name;

  @NotBlank
  private String handle;

}
