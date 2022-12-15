export function getVoice(language: string, index = 0) {
  return speechSynthesis
    .getVoices()
    .filter(ssv => ssv.lang == language)
    .sort(
      (a, b) =>
        (a.name.includes("male") ? 0 : 1) - (b.name.includes("male") ? 0 : 1)
    )
    .sort((a, b) => (a.localService ? 0 : 1) - (b.localService ? 0 : 1))[index]
}

export function utterance(language: string, text: string, index?: number) {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.voice = getVoice(language, index)
  console.log("voice", utterance.voice)
  return utterance
}
