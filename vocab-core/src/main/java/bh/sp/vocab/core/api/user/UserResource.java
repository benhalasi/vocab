package bh.sp.vocab.core.api.user;

import java.time.Duration;
import java.util.UUID;

import javax.persistence.NoResultException;
import javax.ws.rs.POST;
import javax.ws.rs.Path;

import bh.sp.vocab.core.VocabCoreApp;
import bh.sp.vocab.core.api.ResourceRoot;
import bh.sp.vocab.core.model.user.UserEntity;
import io.smallrye.mutiny.Uni;

@Path(UserResource.BASE_URI)
public class UserResource extends ResourceRoot<UserEntity, UserPost, UserUpdate, User> {

  public static final String BASE_URI = VocabCoreApp.NIGHLTY_API + "/user";

  public UserResource() {
    super(UserEntity.class);
  }

  @Override
  protected User convertToResult(UserEntity entity) {
    return new User(entity);
  }

  @Override
  protected Uni<UserEntity> resolveUpdate(UserUpdate update) {
    return UserEntity.findByUuid(update.getUuid());
  }

  @Override
  protected UserEntity resolvePost(UserPost postBean) {
    return UserEntity.builder()
        .name(postBean.getName())
        .handle(postBean.getHandle())
        .build();
  }

  @Override
  protected Uni<UserEntity> updateEntity(UserEntity entity, UserUpdate update) {
    entity.setName(update.getName());
    return entity.persistAndFlush();
  }

  @POST
  @Path("-/auth")
  public Uni<User> auth(HandleAndPassword handleAndPassword) {
    return UserEntity.findByHandleAndPassword(handleAndPassword.getHandle(), handleAndPassword.getPassword())
        .map(User::new)
        .onFailure(NoResultException.class).recoverWithUni(Uni.createFrom()::nullItem)
        .onItem().delayIt().by(Duration.ofSeconds(1));
  }

  @POST
  @Path("-/uuid")
  public Uni<User> uuid(UUID uuid) {
    return UserEntity.findByUuid(uuid)
        .map(User::new)
        .onFailure(NoResultException.class).recoverWithUni(Uni.createFrom()::nullItem)
        .onItem().delayIt().by(Duration.ofSeconds(1));
  }

}
