package bh.sp.vocab.core.api.user;

import javax.validation.constraints.NotBlank;

import org.hibernate.validator.constraints.Length;

import lombok.Data;

@Data
public class HandleAndPassword {

  @NotBlank
  String handle;

  @NotBlank
  @Length(min = 8, max = 255)
  // @Pattern(regexp =
  // "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&'])[^]{8,255}$")
  String password;
}
