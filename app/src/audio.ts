const labels = {
  es: { listen: 'Escuchar', stop: 'Detener', missing: 'No hay voz en español disponible en este dispositivo.', error: 'No se pudo reproducir el audio. Puedes seguir leyendo.' },
  en: { listen: 'Listen', stop: 'Stop', missing: 'No English voice is available on this device.', error: 'Audio could not play. You can keep reading.' }
}

let current: SpeechSynthesisUtterance | undefined

export function stopReading() {
  if (!current) return
  current = undefined
  window.speechSynthesis.cancel()
}

export function readingControl(text: string, language: string) {
  const lang = language === 'en' ? 'en' : 'es'
  const words = labels[lang]
  const wrapper = document.createElement('div')
  const status = document.createElement('small')
  status.setAttribute('role', 'status')
  wrapper.className = 'reading-control'

  if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
    status.textContent = words.missing
    wrapper.append(status)
    return wrapper
  }

  const synth = window.speechSynthesis
  // Some browsers discover installed voices asynchronously after this first call.
  synth.getVoices()
  const button = document.createElement('button')
  button.type = 'button'
  button.className = 'secondary'
  button.textContent = words.listen
  button.onclick = () => {
    if (current) {
      stopReading()
      button.textContent = words.listen
      return
    }
    const voice = synth.getVoices().find(item =>
      item.localService && item.lang.toLowerCase().split(/[-_]/)[0] === lang)
    if (!voice) {
      status.textContent = words.missing
      return
    }
    const speech = new SpeechSynthesisUtterance(text)
    speech.voice = voice
    speech.lang = voice.lang
    function finish(failed: boolean) {
      if (current !== speech) return
      current = undefined
      button.textContent = words.listen
      if (failed) status.textContent = words.error
    }
    speech.onend = () => finish(false)
    speech.onerror = () => finish(true)
    current = speech
    status.textContent = ''
    button.textContent = words.stop
    try { synth.speak(speech) } catch { finish(true) }
  }
  wrapper.append(button, status)
  return wrapper
}
