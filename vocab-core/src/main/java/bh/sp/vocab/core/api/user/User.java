package bh.sp.vocab.core.api.user;

import java.util.UUID;

import javax.validation.constraints.NotBlank;

import bh.sp.vocab.core.api.beans.ResponseBean;
import bh.sp.vocab.core.model.user.UserEntity;
import lombok.Data;

@Data
public class User implements ResponseBean {

  public User(UserEntity user) {
    name = user.getName();
    handle = user.getHandle();
    uuid = user.getUuid();
  }

  @NotBlank
  private String name;

  @NotBlank
  private String handle;

  @NotBlank
  private UUID uuid;

}
