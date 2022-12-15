package bh.sp.vocab.core.api.vocab.item.event;

import javax.validation.constraints.NotNull;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class VocabItemEventResponse {

  @NotNull
  private double confidence;
}
