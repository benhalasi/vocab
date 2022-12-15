package bh.sp.vocab.core.api;

import java.util.List;
import java.util.stream.Collectors;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response.Status;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import bh.sp.vocab.core.api.beans.PostBean;
import bh.sp.vocab.core.api.beans.ResponseBean;
import bh.sp.vocab.core.api.beans.UpdateBean;
import io.quarkus.hibernate.reactive.panache.Panache;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import io.smallrye.mutiny.Uni;
import io.vertx.ext.web.handler.HttpException;

public abstract class Resource<Entity extends PanacheEntity, Parent extends PanacheEntity, Post extends PostBean, Update extends UpdateBean, Result extends ResponseBean, ParentId> {

  protected final Logger log = LoggerFactory.getLogger(this.getClass());

  private final Class<Entity> entityClass;

  public Resource(Class<Entity> entityClass) {
    this.entityClass = entityClass;
  }

  protected abstract Result convertToResult(Entity entity);

  protected abstract Uni<Parent> getParent(ParentId parentId);

  // TODO: pagination
  protected abstract Uni<List<Entity>> getList(Parent parent);

  protected abstract Uni<Entity> getEntity(Parent parent, long id);

  protected Uni<Entity> resolvePost(ParentId parentId, Post post) {
    throw new HttpException(Status.NOT_IMPLEMENTED.getStatusCode());
  }

  protected Uni<Entity> resolveUpdate(ParentId parentId, long id, Update update) {
    throw new HttpException(Status.NOT_IMPLEMENTED.getStatusCode());
  }

  protected Uni<Entity> updateEntity(Entity entity, Update update) {
    throw new HttpException(Status.NOT_IMPLEMENTED.getStatusCode());
  }

  public Uni<Void> removeOrphans(Entity entity) {
    return Uni.createFrom().voidItem();
  }

  @GET
  @Path("/")
  public Uni<List<Result>> list(@QueryParam("parent") ParentId parentId) {
    return Panache.withTransaction(() -> getParent(parentId)
        .flatMap(parent -> getList(parent))
        .map(list -> list.stream()
            .map(this::convertToResult)
            .collect(Collectors.toList())));
  }

  @POST
  @Path("/")
  public Uni<Result> post(@QueryParam("parent") ParentId parentId, Post postBean) {
    return resolvePost(parentId, postBean)
        .flatMap(entity -> entity.persistAndFlush())
        .onItem().castTo(entityClass)
        .map(this::convertToResult);
  }

  @GET
  @Path("/{id}")
  public Uni<Result> get(@QueryParam("parent") ParentId parentId, long id) {
    return Panache.withTransaction(() -> getParent(parentId)
        .flatMap(parent -> getEntity(parent, id))
        .map(this::convertToResult));
  }

  @PUT
  @Path("/{id}")
  public Uni<Result> put(@QueryParam("parent") ParentId parentId, long id, Update update) {
    return Panache
        .withTransaction(() -> resolveUpdate(parentId, id, update)
            .flatMap(entity -> updateEntity(entity, update)))
        .map(this::convertToResult);
  }

  @DELETE
  @Path("/{id}")
  public Uni<Void> delete(@QueryParam("parent") ParentId parentId, long id) {
    return Panache.withTransaction(() -> getParent(parentId)
        .flatMap(parent -> getEntity(parent, id))
        .call(this::removeOrphans)
        .flatMap(entity -> entity.delete()));
  }

}
