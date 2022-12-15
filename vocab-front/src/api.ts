import {
  Configuration,
  UserResourceApi,
  VocabItemEventRegisterApi,
  VocabItemResourceApi,
  VocabSetResourceApi,
  WordResourceApi,
} from "schema/core"

const configuration = new Configuration({
  basePath: process.env.WOCABB__CORE_BASE_PATH,
})

const userResource = new UserResourceApi(configuration)
const vocabSetResource = new VocabSetResourceApi(configuration)
const vocabItemResource = new VocabItemResourceApi(configuration)
const wordResource = new WordResourceApi(configuration)
const eventApi = new VocabItemEventRegisterApi(configuration)

export {
  userResource,
  vocabSetResource,
  vocabItemResource,
  wordResource,
  eventApi,
}
