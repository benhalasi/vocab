package bh.sp.vocab.core.api.vocab.item.event;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import bh.sp.vocab.core.VocabCoreApp;
import bh.sp.vocab.core.model.vocab.item.VocabItemEntity;
import bh.sp.vocab.core.model.vocab.item.event.VocabItemEventEntity;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.smallrye.mutiny.Uni;
import io.vertx.ext.web.handler.HttpException;

@Path(VocabCoreApp.NIGHLTY_API + "/vocab-item/{vocab-item-id}/event")
public class VocabItemEventRegister {

  private static final Logger log = LoggerFactory.getLogger(VocabItemEventRegister.class);

  @POST
  public Uni<VocabItemEventResponse> registerEvent(
      @PathParam("vocab-item-id") long vocabItemId,
      VocabItemEventEntity event) {
    return Panache.withTransaction(() -> {
      return VocabItemEntity.findById(vocabItemId)
          .onItem().ifNull().failWith(() -> new HttpException(Status.NOT_FOUND.getStatusCode()))
          .onItem().castTo(VocabItemEntity.class)
          .flatMap(vocabItem -> normalizeEvent(event, vocabItem))
          .map(vie -> VocabItemEventResponse.builder()
              .confidence(vie.getConfidenceSnapshot())
              .build());
    });
  }

  private Uni<VocabItemEventEntity> normalizeEvent(VocabItemEventEntity requestedEvent, VocabItemEntity vocabItem) {
    var event = VocabItemEventEntity.builder()
        .vocabItem(vocabItem)
        .type(requestedEvent.getType())
        .success(requestedEvent.isSuccess())
        .direct(requestedEvent.isDirect())
        .build();

    event.setConfidenceSnapshot(calculateConfidence(event, vocabItem));

    return event.persist();
  }

  private double calculateConfidence(VocabItemEventEntity event, VocabItemEntity vocabItem) {
    return vocabItem.getOptionalLastEvent().map(VocabItemEventEntity::getConfidenceSnapshot).orElse(0d)
        + calculateConfidenceDelta(event, vocabItem);
  }

  private double calculateConfidenceDelta(VocabItemEventEntity event, VocabItemEntity vocabItem) {
    switch (event.getType()) {
      case MANUAL_FEEDBACK:
        return event.isSuccess() ? 1d : -1d;
      case Q_CHOICE_4:
        return event.isSuccess() ? .1d : -.4d;
      case Q_CHOICE_4_BAD_ALT:
        return -.1d;
      case Q_FREE_TEXT:
        return event.isSuccess() ? .3d : -.5d;
      default:
        log.error("unhandled case {}. (will fallback to 0d confidence delta)", event.getType());
        throw new RuntimeException("unhandled event type " + event.getType());
    }
  }
}
