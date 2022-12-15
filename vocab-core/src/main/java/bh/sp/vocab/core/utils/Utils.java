package bh.sp.vocab.core.utils;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;

public final class Utils {

  private Utils() {}

  @Data
  @AllArgsConstructor(access = AccessLevel.PRIVATE)
  public static final class Between <N extends Number & Comparable<N>> implements Function<N, N> {
    private final N min;
    private final N max;

    @Override
    public N apply(N n) {
      return min.compareTo(n) > 0 ? min : max.compareTo(n) < 0 ? max : n;
    }
  }

  private static final Map<Object, Map<Object, Between<?>>> betweens = new HashMap<>();

  /**
   * @param min
   * @param max
   * @return validator
   * @throws {@link ArithmeticException} when {@code min > max}
   */
  @SuppressWarnings("unchecked")
  public static <N extends Number & Comparable<N>> Between<N> between (N min, N max) {
    if ( max.compareTo(min) < 0 ) throw new ArithmeticException("min (" + min + ") mustn't be more than max (" + max + ")!");
    return (Between<N>) betweens
    .computeIfAbsent(min, k -> new HashMap<>())
    .computeIfAbsent(max, k -> new Between<>(min, max));
  }
}
