package bh.sp.vocab.core.model.vocab.item;

import javax.persistence.Embeddable;
import javax.validation.constraints.NotBlank;

import io.smallrye.common.constraint.Nullable;
import lombok.Data;

@Data
@Embeddable
public class Word {

  public static Word of(String word) {
    Word result = new Word();
    result.setWord(word);
    return result;
  }

  public static Word of(String word, String bracketInfo) {
    Word result = Word.of(word);
    result.setBracketInfo(bracketInfo);
    return result;
  }

  @NotBlank
  private String word;

  /**
   * should be interpreted as some sort of extension or extra info of
   * {@code Word.code}
   */
  private @Nullable String bracketInfo;
}
