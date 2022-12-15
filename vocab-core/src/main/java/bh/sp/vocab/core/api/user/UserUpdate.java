package bh.sp.vocab.core.api.user;

import java.util.UUID;

import javax.validation.constraints.NotBlank;

import bh.sp.vocab.core.api.beans.UpdateBean;
import lombok.Data;

@Data
public class UserUpdate implements UpdateBean {

  @NotBlank
  private UUID uuid;

  @NotBlank
  private String name;
}
