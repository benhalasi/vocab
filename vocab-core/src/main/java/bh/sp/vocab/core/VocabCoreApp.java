package bh.sp.vocab.core;

import javax.enterprise.event.Observes;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import io.quarkus.runtime.Quarkus;
import io.quarkus.runtime.ShutdownEvent;
import io.quarkus.runtime.StartupEvent;

public class VocabCoreApp {

  public static final String NIGHLTY_API = "";

  private static final Logger LOGGER = LoggerFactory.getLogger(VocabCoreApp.class);

  public static void main(String... args) {
    System.out.println("Running main method");
    Quarkus.run(args);
  }

  void onStart(@Observes StartupEvent ev) {
    LOGGER.info("The application is starting...");
  }

  void onStop(@Observes ShutdownEvent ev) {
    LOGGER.info("The application is stopping...");
  }
}
