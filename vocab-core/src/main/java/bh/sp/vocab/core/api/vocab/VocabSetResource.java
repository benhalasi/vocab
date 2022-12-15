package bh.sp.vocab.core.api.vocab;

import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.inject.Inject;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response.Status;

import org.hibernate.reactive.mutiny.Mutiny;

import bh.sp.vocab.core.VocabCoreApp;
import bh.sp.vocab.core.api.Resource;
import bh.sp.vocab.core.api.vocab.item.VocabItemResource;
import bh.sp.vocab.core.model.user.UserEntity;
import bh.sp.vocab.core.model.vocab.VocabSetEntity;
import io.smallrye.mutiny.Uni;
import io.vertx.ext.web.handler.HttpException;

@Path(VocabSetResource.BASE_URI)
public class VocabSetResource
    extends Resource<VocabSetEntity, UserEntity, VocabSetPayload, VocabSetPayload, VocabSet, UUID> {

  public static final String BASE_URI = VocabCoreApp.NIGHLTY_API + "/vocab-set";

  @Inject
  VocabItemResource vocabItemResource;

  public VocabSetResource() {
    super(VocabSetEntity.class);
  }

  @Override
  protected VocabSet convertToResult(VocabSetEntity entity) {
    return new VocabSet(entity);
  }

  @Override
  protected Uni<UserEntity> getParent(UUID parentId) {
    return UserEntity.findByUuid(parentId);
  }

  @Override
  protected Uni<List<VocabSetEntity>> getList(UserEntity parent) {
    return Mutiny.fetch(parent.getVocabSets());
  }

  @Override
  protected Uni<VocabSetEntity> getEntity(UserEntity parent, long id) {
    return VocabSetEntity.findById(id)
        .onItem().ifNull().failWith(() -> new HttpException(Status.NOT_FOUND.getStatusCode()))
        .onItem().castTo(VocabSetEntity.class)
        .call(vocabSet -> {
          if (!parent.id.equals(vocabSet.getUser().id)) {
            throw new HttpException(Status.FORBIDDEN.getStatusCode());
          }
          return Uni.createFrom().voidItem();
        });
  }

  @Override
  protected Uni<VocabSetEntity> resolvePost(UUID parentId, VocabSetPayload postBean) {
    return getParent(parentId)
        .map(user -> VocabSetEntity.builder()
            .user(user)
            .known(postBean.getKnown())
            .learnt(postBean.getLearnt())
            .build());
  }

  @Override
  protected Uni<VocabSetEntity> resolveUpdate(UUID parentId, long id, VocabSetPayload update) {
    return getParent(parentId)
        .chain(user -> getEntity(user, id));
  }

  @Override
  protected Uni<VocabSetEntity> updateEntity(VocabSetEntity entity, VocabSetPayload update) {
    entity.setState(update.getState());
    entity.setKnown(update.getKnown());
    entity.setLearnt(update.getLearnt());
    return entity.persist();
  }

  @Override
  public Uni<Void> removeOrphans(VocabSetEntity entity) {
    return Mutiny.fetch(entity.getWords())
        .onItem().ifNull().continueWith(Collections::emptyList)
        .call(vocabItems -> {
          var vocabItemOrphanRemovals = vocabItems.stream()
              .map(vocabItemResource::removeOrphans)
              .collect(Collectors.toList());
          return Uni.combine().all().unis(vocabItemOrphanRemovals).discardItems();
        })
        .invoke(vocabItems -> vocabItems.removeIf(vocabItem -> true))
        .chain(Uni.createFrom()::voidItem);
  }

}
