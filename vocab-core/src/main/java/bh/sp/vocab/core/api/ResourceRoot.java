package bh.sp.vocab.core.api;

import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
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

public abstract class ResourceRoot<Entity extends PanacheEntity, Post extends PostBean, Update extends UpdateBean, Result extends ResponseBean> {

  protected final Logger log = LoggerFactory.getLogger(this.getClass());

  private final Class<Entity> entityClass;

  public ResourceRoot(Class<Entity> entityClass) {
    this.entityClass = entityClass;
  }

  protected abstract Result convertToResult(Entity entity);

  protected Entity resolvePost(Post post) {
    throw new HttpException(Status.NOT_IMPLEMENTED.getStatusCode());
  }

  protected Uni<Entity> resolveUpdate(Update update) {
    throw new HttpException(Status.NOT_IMPLEMENTED.getStatusCode());
  }

  protected Uni<Entity> updateEntity(Entity entity, Update update) {
    throw new HttpException(Status.NOT_IMPLEMENTED.getStatusCode());
  }

  @POST
  @Path("/")
  public Uni<Result> post(Post postBean) {
    return resolvePost(postBean).persistAndFlush()
        .onItem().castTo(entityClass)
        .map(this::convertToResult);
  }

  @PUT
  @Path("/")
  public Uni<Result> put(Update update) {
    return Panache
        .withTransaction(() -> resolveUpdate(update)
            .onItem().ifNotNull().transformToUni(entity -> updateEntity(entity, update)))
        .map(this::convertToResult);
  }
}
