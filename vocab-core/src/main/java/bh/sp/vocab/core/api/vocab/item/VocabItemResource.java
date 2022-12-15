package bh.sp.vocab.core.api.vocab.item;

import java.util.List;

import javax.ws.rs.Path;

import org.hibernate.reactive.mutiny.Mutiny;

import bh.sp.vocab.core.VocabCoreApp;
import bh.sp.vocab.core.api.Resource;
import bh.sp.vocab.core.model.vocab.VocabSetEntity;
import bh.sp.vocab.core.model.vocab.item.VocabItemEntity;
import io.smallrye.mutiny.Uni;

@Path(VocabItemResource.BASE_URI)
public class VocabItemResource
    extends Resource<VocabItemEntity, VocabSetEntity, VocabItemPayload, VocabItemPayload, VocabItem, Long> {

  public static final String BASE_URI = VocabCoreApp.NIGHLTY_API + "/vocab-item";

  public VocabItemResource() {
    super(VocabItemEntity.class);
  }

  @Override
  public VocabItem convertToResult(VocabItemEntity entity) {
    return new VocabItem(entity);
  }

  @Override
  protected Uni<VocabSetEntity> getParent(Long parentId) {
    return VocabSetEntity.findById(parentId);
  }

  @Override
  protected Uni<List<VocabItemEntity>> getList(VocabSetEntity parent) {
    return Mutiny.fetch(parent.getWords());
  }

  @Override
  protected Uni<VocabItemEntity> getEntity(VocabSetEntity parent, long id) {
    return VocabItemEntity.findById(id);
  }

  @Override
  protected Uni<VocabItemEntity> resolvePost(Long parentId, VocabItemPayload post) {
    return getParent(parentId)
        .map(vocabSet -> VocabItemEntity.builder()
            .vocabSet(vocabSet)
            .known(post.getKnown())
            .learnt(post.getLearnt())
            .build());
  }

  @Override
  protected Uni<VocabItemEntity> resolveUpdate(Long parentId, long id, VocabItemPayload update) {
    return getParent(parentId)
        .chain(vocabSet -> getEntity(vocabSet, id));
  }

  @Override
  protected Uni<VocabItemEntity> updateEntity(VocabItemEntity entity, VocabItemPayload update) {
    entity.setKnown(update.getKnown());
    entity.setLearnt(update.getLearnt());
    return entity.persist();
  }

  @Override
  public Uni<Void> removeOrphans(VocabItemEntity entity) {
    return Mutiny.fetch(entity.getEvents())
        .invoke(events -> events.removeIf(event -> true))
        .chain(Uni.createFrom()::voidItem);
  }

}
