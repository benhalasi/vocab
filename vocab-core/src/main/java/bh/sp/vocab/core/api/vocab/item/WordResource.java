package bh.sp.vocab.core.api.vocab.item;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response.Status;

import org.hibernate.reactive.mutiny.Mutiny;

import bh.sp.vocab.core.model.user.UserEntity;
import bh.sp.vocab.core.model.vocab.Language;
import bh.sp.vocab.core.model.vocab.VocabSetEntity;
import bh.sp.vocab.core.model.vocab.VocabSetState;
import bh.sp.vocab.core.model.vocab.item.VocabItemEntity;
import bh.sp.vocab.core.model.vocab.item.VocabItemEntity.Mode;
import io.smallrye.mutiny.Uni;
import io.vertx.ext.web.handler.HttpException;
import lombok.Data;

@Path("words")
public class WordResource {

  @Inject
  VocabItemResource vocabItemResource;

  @POST
  public Uni<List<VocabItem>> words(Query query) {
    return UserEntity.findByUuid(query.getOwnerUUID())
        .onFailure().recoverWithNull()
        .onItem().ifNull().failWith(() -> new HttpException(Status.NOT_FOUND.getStatusCode(), "user not found"))
        .chain(owner -> Mutiny.fetch(owner.getVocabSets()))
        .map(vocabSets -> vocabSets.stream()
            .filter(vs -> filterVocabSets(vs, query))
            // .map(vs -> vs.id)
            .collect(Collectors.toSet()))
        .chain(vss -> {
          if (vss.isEmpty())
            throw new HttpException(Status.NOT_FOUND.getStatusCode(), "0 vocabset found");
          return VocabItemEntity.find(vss, query.getMode(), query.getAmount());
        })
        .map(vocabItems -> vocabItems.stream()
            .map(vocabItemResource::convertToResult)
            .collect(Collectors.toList())
        //
        )
    //
    ;
  }

  private boolean filterVocabSets(VocabSetEntity vs, Query query) {
    return vs.getState() == VocabSetState.ENABLED
        && vs.getKnown() == query.getKnown()
        && vs.getLearnt() == query.getLearnt();
  }

  @Data
  public static final class Query {

    @NotNull
    @NotBlank
    private UUID ownerUUID;

    @NotNull
    @NotBlank
    private Language known;

    @NotNull
    @NotBlank
    private Language learnt;

    @NotNull
    @NotBlank
    private Mode mode;

    @NotNull
    @NotBlank
    @Min(1)
    @Max(20)
    private int amount;
  }
}
