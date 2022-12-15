package bh.sp.vocab.core.model.user;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.OneToMany;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

import com.fasterxml.jackson.annotation.JsonIgnoreType;

import bh.sp.vocab.core.model.vocab.VocabSetEntity;
import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import io.quarkus.logging.Log;
import io.quarkus.panache.common.Parameters;
import io.smallrye.mutiny.Uni;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Entity(name = UserEntity.TABLE_NAME)
@JsonIgnoreType
public class UserEntity extends PanacheEntity {

  static final String TABLE_NAME = "userx";

  private String name;

  @Column(unique = true, updatable = false)
  private String handle;

  @Column(unique = true)
  private UUID uuid;

  @Builder.Default
  @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true, mappedBy = "user")
  private final List<VocabSetEntity> vocabSets = new ArrayList<>();

  public static Uni<UserEntity> findByHandleAndPassword(String handle, String password) {
    return UserEntity
        .find("from " + UserEntity.TABLE_NAME + " where handle = :handle",
            Parameters.with("handle", handle))
        .singleResult()
        .onItem().castTo(UserEntity.class);
  }

  public static Uni<UserEntity> findByUuid(UUID uuid) {
    return UserEntity
        .find("from " + UserEntity.TABLE_NAME + " where uuid = :uuid",
            Parameters.with("uuid", uuid))
        .singleResult()
        .onItem().castTo(UserEntity.class);
  }

  @PrePersist
  public void prePersist() {
    uuid = UUID.randomUUID();
    ensureOwnershipOfVocabsets();
  }

  @PreUpdate
  public void preUpdate() {
    if (uuid == null) {
      Log.warn("absent uuid");
      uuid = UUID.randomUUID();
    }
    ensureOwnershipOfVocabsets();
  }

  private void ensureOwnershipOfVocabsets() {
    // vocabSets.forEach(vocabSet -> {
    // vocabSet.setOwner(this);
    // });
  }

}
