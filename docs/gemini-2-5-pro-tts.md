# Gemini 2.5 Pro TTS: exhaustive voice style control cheat sheet

Google's Gemini 2.5 TTS models give developers **three primary control levers** for voice style: structured style prompts (the "Director's Chair" framework), inline bracketed markup tags, and API-level configuration including voice selection and temperature. This cheat sheet documents every known mechanism, parameter, working tag, and best practice — with specific guidance for building calm, therapeutic French-Québec narration.

The TTS capability launched at Google I/O in May 2025 as a preview, received a major expressivity upgrade in December 2025, and reached GA on Cloud TTS in early 2026 with **30 voices across 80+ locales**. Two model tiers exist: **Pro** (higher quality, better at nuanced style adherence) and **Flash** (lower latency, cost-efficient). Both accept text-only input and produce audio-only output.

---

## 1. Style prompts: the "Director's Chair" framework

Google's official documentation recommends structuring your prompt as if you are a **film director setting a scene for a virtual voice actor**. The recommended five-component structure is:

| Component | Purpose | Required? |
|-----------|---------|-----------|
| **Audio Profile** | Character identity — name, archetype, age, background | Recommended |
| **Scene** | Physical environment and emotional atmosphere | Optional but powerful |
| **Director's Notes** | Style, dynamics, pacing, accent, breathing instructions | Core control layer |
| **Sample Context** | Contextual framing so the actor "enters" naturally | Optional |
| **Transcript** | The actual text to be spoken | Required |

### How it works

Style instructions go directly into the `contents` text field — there is **no separate system instruction field** for TTS models. Everything (direction + transcript) is a single prompt. The model interprets the natural-language directions and applies them to the transcript.

### Official example from Google

```
# AUDIO PROFILE: Jaz R.
## "The Morning Hype"

## THE SCENE: The London Studio
It is 10:00 PM in a glass-walled studio overlooking the moonlit London skyline,
but inside, it is blindingly bright. The red "ON AIR" tally light is blazing.
Jaz is standing up, not sitting, bouncing on the balls of their heels to the
rhythm of a thumping backing track.

### DIRECTOR'S NOTES
Style:
* The "Vocal Smile": You must hear the grin in the audio. The soft palate is
always raised to keep the tone bright, sunny, and explicitly inviting.
* Dynamics: High projection without shouting. Punchy consonants and elongated
vowels on excitement words (e.g., "Beauuutiful morning").

Pace: Speaks at an energetic pace, keeping up with the fast music. A "bouncing"
cadence. High-speed delivery with fluid transitions — no dead air, no gaps.

Accent: Jaz is from Brixton, London

### SAMPLE CONTEXT
Jaz is the industry standard for Top 40 radio, high-octane event promos, or any
script that requires a charismatic Estuary accent and 11/10 infectious energy.

#### TRANSCRIPT
Yes, massive vibes in the studio! You are locked in...
```

### Therapeutic coaching example (French Québec)

```
# PROFIL AUDIO : Coach Sophie
## Guide bienveillante en développement personnel

## LA SCÈNE
Un bureau chaleureux et lumineux dans un centre de mieux-être à Montréal.
Lumière tamisée, plantes vertes, fauteuil confortable. L'atmosphère est calme,
sécurisante et intime — comme une conversation entre amies de confiance.

### NOTES DE RÉALISATION
Style : Voix chaleureuse et thérapeutique. Calme et rassurante, avec un léger
sourire dans la voix. Empathique sans être condescendante. Accessible et
naturelle, comme si elle parlait directement à une seule personne.

Rythme : Lent et mesuré, avec des pauses délibérées pour la réflexion.
Pas de précipitation. Les fins de phrases descendent doucement.

Accent : Français québécois naturel, tel que parlé à Montréal. Chaleureux
et familier, pas formel. Utiliser les intonations québécoises authentiques.

Dynamique : Volume doux et constant. Aucune projection excessive.
Consonnes douces, voyelles allongées sur les mots-clés réconfortants.

### CONTEXTE
Sophie est une coach en développement personnel qui accompagne ses clients
dans un processus de croissance personnelle. Son ton inspire confiance
et sécurité.

#### TRANSCRIPTION
[Votre texte français ici]
```

### Director's Notes — three key dimensions to control

**Style** ranges from simple to complex:
- Simple: `Style: Calm and reassuring therapeutic coach.`
- Medium: `Style: Warm, empathetic life coach who makes every listener feel heard and supported.`
- Complex: Use evocative metaphors like "Vocal Smile" or "The Drift" (see pacing below)

**Pacing** examples:
- Simple: `Pacing: Slow and measured`
- Medium: `Pacing: Speaks slowly with deliberate pauses for reflection. No rushing.`
- Complex: `Pacing: The "Drift": The tempo is incredibly slow and liquid. Words bleed into each other. There is zero urgency.`

**Accent** — be specific:
- Generic (less effective): `Accent: French Canadian`
- Specific (better): `Accent: Français québécois tel que parlé à Montréal, Québec. Chaleureux et naturel.`

### Key tips for style prompts

**Coherence is critical.** Google calls this the "three levers" rule: the style prompt, the text content semantics, and any markup tags must all align. A scared-tone prompt paired with text like "I think someone is in the house" produces reliable results. The same prompt with "The meeting is at 4 PM" produces inconsistent results.

**Don't over-describe.** Google explicitly advises: "Don't feel you have to describe everything. Sometimes giving the model space to fill in the gaps helps naturalness — just like a talented actor." Over-specification can make delivery sound robotic.

**Use Gemini to draft your prompts.** Google recommends using a general Gemini model to help sketch character profiles and Director's Notes from a blank outline.

---

## 2. Bracketed emotion and action tags — complete reference

Bracketed tags like `[whispering]` or `[sigh]` are inline markup placed directly in the transcript text. They are **not officially documented as a formal feature** in the Gemini API docs, but they are now described in the Google Cloud TTS documentation with an explicit three-mode framework, and they work reliably in practice.

### The three modes of bracketed tags

This is critical to understand — not all tags behave the same way:

| Mode | Behavior | Tag spoken aloud? | Example |
|------|----------|-------------------|---------|
| **Vocalization** | Tag is replaced by an audible non-speech sound (sigh, laugh, throat-clear) | No | `[sigh]`, `[laughing]`, `[clears throat]` |
| **Delivery Modifier** | Tag silently modifies the style of subsequent speech | No | `[whispering]`, `[speaking slowly]`, `[shouting]` |
| **Spoken-as-Word** ⚠️ | Tag is spoken aloud as a literal word AND influences tone | **Yes** — problematic | `[happy]`, `[sad]`, `[excited]` |

**Google's official recommendation**: "Because the tag itself is spoken, Mode 3 is likely an undesired side effect for most use cases. **Prefer using the Style Prompt to set these emotional tones instead.**"

### Complete tag reference by category

#### Emotions (use in style prompts for reliability; inline tags may trigger Mode 3)

| Tag | Reliability | Notes |
|-----|------------|-------|
| `[angry]` | ✅ Works | Clear tonal shift |
| `[excited]` | ✅ Works | Noticeable energy increase |
| `[sarcastic]` | ✅ Works | Subtle but present |
| `[scornful]` | ✅ Works | Contemptuous delivery |
| `[empathetic]` | ✅ Works | Softer, caring tone |
| `[happy]` | ⚠️ May be spoken aloud | Mode 3 risk — prefer style prompt |
| `[sad]` | ⚠️ May be spoken aloud | Mode 3 risk — prefer style prompt |
| `[fearful]` | ✅ Works | Trembling quality |
| `[disgusted]` | ✅ Works | Aversion in voice |
| `[surprised]` | ✅ Works | Sudden pitch shift |
| `[furious]` | ✅ Works | More intense than angry |
| `[thoughtful]` | ✅ Works | Contemplative, slower |
| `[menacing]` | ✅ Works | Low, threatening quality |
| `[playful]` | ✅ Works | Light, teasing quality |
| `[resigned]` | ✅ Works | Defeated acceptance |

#### Vocal effects / vocalizations (Mode 1 — most reliable)

| Tag | Reliability | Notes |
|-----|------------|-------|
| `[laughing]` | ✅ Reliable | Produces audible laugh |
| `[sighing]` | ✅ Reliable | Produces audible sigh |
| `[clears throat]` | ✅ Reliable | Audible throat-clear |
| `[gasp]` | ✅ Works | Sharp intake of breath |
| `[uhm]` | ✅ Works | Used in Google's own example |
| `[crowd laughing]` | ❌ Fails | Environmental sounds not supported |
| `[audience laughing]` | ❌ Fails | Only single-speaker vocalizations work |

#### Delivery modifiers (Mode 2 — reliable)

| Tag | Reliability | Notes |
|-----|------------|-------|
| `[whispering]` | ✅ Reliable | Breathy, quiet delivery |
| `[shouting]` | ✅ Reliable | Loud, projected delivery |
| `[speaking slowly]` | ✅ Reliable | Reduced pace |
| `[extremely fast]` | ✅ Works | Used in Google's official example |
| `[slow]` | ✅ Works | Reduced pace |
| `[measured]` | ✅ Works | Deliberate, even pacing |

#### Tone and texture modifiers

| Tag | Reliability | Notes |
|-----|------------|-------|
| `[gravelly]` | ✅ Works | Rough vocal texture |
| `[low]` | ✅ Works | Lower pitch register |
| `[quiet emphasis]` | ✅ Works | Soft but intense |
| `[teasing]` | ✅ Works | Playful provocation |
| `[casual]` | ✅ Works | Relaxed, conversational |
| `[soft]` | ✅ Works | Gentle, low volume |
| `[intimate]` | ✅ Works | Close, personal quality |

#### Pause and pacing tags

| Tag | Reliability | Notes |
|-----|------------|-------|
| `[pause]` | ✅ Works | Brief pause |
| `[long pause]` | ✅ Works | Extended pause |
| `[short pause]` | ✅ Works | Brief pause |
| `[1s pause]` | ✅ Works | Timed pause |
| `[PAUSE=2s]` | ✅ Works | All-caps shortcut for timed pause |

### Combining multiple tags

Tags can be stacked and interleaved through the transcript:

```
[playful][casual] Oh, come on! [pause] You're taking this way too seriously.
[laughing] Not everything has to be a life-or-death drama, you know?
[teasing] Sometimes… it's okay to just enjoy the moment.
```

Common effective combinations:
- `[menacing][quiet]` — villain's whispered threat
- `[soft][intimate]` — personal confession
- `[playful][casual]` — friendly banter
- `[empathetic][speaking slowly]` — therapeutic reassurance (ideal for your use case)

### Therapeutic narration tag patterns

For calm coaching content, these combinations work well:

```
[soft][speaking slowly] Prenez un moment pour respirer. [pause]
Vous êtes exactement là où vous devez être en ce moment.
[empathetic] C'est normal de ressentir de l'incertitude. [long pause]
Chaque pas, même le plus petit, compte.
```

---

## 3. SSML support — what works and what doesn't

**SSML is not officially documented** for Gemini TTS models. Google's documentation describes natural-language prompting only. However, community testing has demonstrated that **several SSML tags work in practice** — likely because the LLM interprets them as structured instructions. Behavior may vary between the API and AI Studio, and between Pro and Flash models.

### SSML tags that work (community-verified)

| Tag | Example | Notes |
|-----|---------|-------|
| `<break time="Xs"/>` | `Text <break time="2s"/> more text.` | Pauses work reliably |
| `<prosody rate="...">` | `<prosody rate="slow">Slowing down.</prosody>` | Rate control works |
| `<prosody pitch="...">` | `<prosody pitch="low">Deep voice.</prosody>` | Pitch control works |
| `<prosody volume="...">` | `<prosody volume="soft">Quiet.</prosody>` | Volume control works |
| `<emphasis level="...">` | `A <emphasis level="strong">very</emphasis> important point.` | Strong/moderate/reduced |
| `<say-as interpret-as="characters">` | `<say-as interpret-as="characters">AI</say-as>` | Spells out letters |
| `<say-as interpret-as="date">` | `<say-as interpret-as="date" format="mdy">9-10-2025</say-as>` | Date pronunciation |
| `<say-as interpret-as="cardinal">` | Numbers read as cardinals | Works |
| `<say-as interpret-as="ordinal">` | Numbers read as ordinals | Works |
| `<say-as interpret-as="time">` | Time reading | Works |
| `<sub alias="...">` | `<sub alias="World Wide Web Consortium">W3C</sub>` | Word substitution |
| `<phoneme alphabet="ipa">` | `<phoneme alphabet="ipa" ph="təˈmeɪtoʊ">tomato</phoneme>` | IPA pronunciation |
| `<lang xml:lang="...">` | `Switch to <lang xml:lang="fr-FR">chat</lang>` | Language switching |

### SSML tags that fail

| Tag | Notes |
|-----|-------|
| `<audio src="...">` | External audio insertion — not supported |
| `<say-as interpret-as="currency">` | Failed in testing |
| `<say-as interpret-as="telephone">` | Failed in testing |
| `<say-as interpret-as="unit">` | Failed in testing |

### Mixing bracketed tags with SSML

Hybrid control works — you can combine both in the same prompt:

```
[empathetic] <break time="1s"/> Je comprends que c'est difficile.
<prosody rate="slow">Prenez tout le temps dont vous avez besoin.</prosody>
```

**Important caveat**: Since SSML is not officially supported, test thoroughly in your deployment environment. What works in AI Studio may behave differently via the API. For production-critical pronunciation control, `<phoneme>` and `<sub>` are particularly useful for ensuring Québécois-specific terms are pronounced correctly.

---

## 4. All 30 prebuilt voices with characteristics

### Female voices (14)

| Voice | Trait | Best for |
|-------|-------|----------|
| **Sulafat** | Warm | 🏆 Therapeutic coaching — warm, welcoming, approachable |
| **Vindemiatrix** | Gentle | 🏆 Gentle guidance — kind, delicate delivery |
| **Achernar** | Soft | 🏆 Soothing narration — soft, calming |
| **Aoede** | Breezy | Relaxed, natural-feeling narration |
| **Despina** | Smooth | Smooth, flowing delivery |
| **Callirrhoe** | Easy-going | Relaxed, friendly conversational tone |
| **Erinome** | Clear | Clear, precise articulation |
| **Gacrux** | Mature | Mature, experienced, steady |
| **Kore** | Firm | Confident, authoritative |
| **Zephyr** | Bright | Cheerful, clear, higher pitch |
| **Autonoe** | Bright | Optimistic, cheerful |
| **Laomedeia** | Upbeat | Lively, positive, higher pitch |
| **Leda** | Youthful | Energetic, younger-sounding |
| **Pulcherrima** | Forward | Expressive, projecting |

### Male voices (16)

| Voice | Trait | Best for |
|-------|-------|----------|
| **Achird** | Friendly | 🏆 Warm male coaching — friendly, approachable |
| **Umbriel** | Easy-going | 🏆 Calm male guide — relaxed, measured |
| **Charon** | Informative | Professional, calm, clear explanations |
| **Algieba** | Smooth | Smooth, pleasant, flowing |
| **Enceladus** | Breathy | Soft, breathy — good for intimate, tired, or vulnerable delivery |
| **Schedar** | Even | Balanced, steady, neutral |
| **Rasalgethi** | Informative | Professional narrator quality |
| **Sadaltager** | Knowledgeable | Authoritative, learned |
| **Iapetus** | Clear | Clean, articulate |
| **Orus** | Firm | Decisive, calm |
| **Alnilam** | Firm | Strong, confident |
| **Puck** | Upbeat | Energetic (default voice) |
| **Fenrir** | Excitable | Dynamic, passionate |
| **Sadachbia** | Lively | Animated, vivid |
| **Zubenelgenubi** | Casual | Conversational, relaxed |
| **Algenib** | Gravelly | Deep, rough texture |

### Top voice recommendations for therapeutic/coaching apps

For **calm, accessible, trustworthy narration** in French Québec:

- **Female top picks**: **Sulafat** (warm), **Vindemiatrix** (gentle), **Achernar** (soft), **Despina** (smooth)
- **Male top picks**: **Achird** (friendly), **Umbriel** (easy-going), **Charon** (informative, calm)

Voice characteristics are preserved across languages — Sulafat will remain warm whether speaking English or French. Pair your voice choice with a style prompt that reinforces the desired therapeutic tone.

---

## 5. Language and locale settings for French Canadian

### Current status of fr-CA

**`fr-CA` (French Canada) is in Preview status.** French France (`fr-FR`) is GA. Both use the same 30 voices.

### Setting locale via the Gemini API

The Gemini API **auto-detects input language** — there is no explicit `language_code` parameter in the standard `generateContent` call. To get French Canadian output:

1. **Write your text in French** — the model will auto-detect
2. **Use Director's Notes to specify Québécois accent**: `Accent : Français québécois naturel, tel que parlé à Montréal.`
3. **Write the full prompt in French** — this reinforces the target language and accent

```python
contents = """
### NOTES DE RÉALISATION
Accent : Français québécois, naturel et chaleureux.
Rythme : Lent et mesuré, avec des pauses pour la réflexion.
Style : Voix thérapeutique, calme, rassurante.

#### TRANSCRIPTION
Aujourd'hui, on va explorer ensemble comment prendre soin de soi
au quotidien. [pause] Prenez une grande respiration...
"""
```

### Setting locale via Cloud Text-to-Speech API

The Cloud TTS API accepts an explicit `language_code` field:

```python
voice = texttospeech.VoiceSelectionParams(
    language_code="fr-CA",
    name="Sulafat",
    model_name="gemini-2.5-pro-tts"
)
```

### Setting locale via Vertex AI API

```python
config=types.GenerateContentConfig(
    speech_config=types.SpeechConfig(
        language_code="fr-CA",
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                voice_name='Sulafat',
            )
        )
    ),
)
```

### Practical tip for Québécois accent

Since `fr-CA` is Preview and auto-detection defaults to `fr-FR` intonation patterns, reinforce the accent in your Director's Notes with specific geographic references: "Accent québécois de Montréal" is more effective than just "accent canadien-français."

---

## 6. API parameters — complete configuration reference

### Model identifiers

| API | Pro Model | Flash Model | Flash Lite |
|-----|-----------|-------------|------------|
| Gemini API | `gemini-2.5-pro-preview-tts` | `gemini-2.5-flash-preview-tts` | — |
| Cloud TTS / Vertex AI | `gemini-2.5-pro-tts` | `gemini-2.5-flash-tts` | `gemini-2.5-flash-lite-preview-tts` |

### Complete single-speaker config (Python SDK)

```python
from google import genai
from google.genai import types

client = genai.Client()

response = client.models.generate_content(
    model="gemini-2.5-pro-preview-tts",
    contents="Dites calmement : Bienvenue dans votre espace de bien-être.",
    config=types.GenerateContentConfig(
        response_modalities=["AUDIO"],
        speech_config=types.SpeechConfig(
            voice_config=types.VoiceConfig(
                prebuilt_voice_config=types.PrebuiltVoiceConfig(
                    voice_name='Sulafat',
                )
            )
        ),
    )
)

# Extract and save audio
data = response.candidates[0].content.parts[0].inline_data.data
```

### Complete single-speaker config (REST/JSON)

```json
{
  "contents": [{
    "parts": [{
      "text": "Dites calmement : Bienvenue dans votre espace de bien-être."
    }]
  }],
  "generationConfig": {
    "responseModalities": ["AUDIO"],
    "speechConfig": {
      "voiceConfig": {
        "prebuiltVoiceConfig": {
          "voiceName": "Sulafat"
        }
      }
    }
  },
  "model": "gemini-2.5-pro-preview-tts"
}
```

### REST endpoint

```
POST https://generativelanguage.googleapis.com/v1beta/models/{MODEL_ID}:generateContent
Header: x-goog-api-key: $GEMINI_API_KEY
```

### Multi-speaker config (Python SDK)

```python
config=types.GenerateContentConfig(
    response_modalities=["AUDIO"],
    speech_config=types.SpeechConfig(
        multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
            speaker_voice_configs=[
                types.SpeakerVoiceConfig(
                    speaker='Sophie',
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name='Sulafat',
                        )
                    )
                ),
                types.SpeakerVoiceConfig(
                    speaker='Client',
                    voice_config=types.VoiceConfig(
                        prebuilt_voice_config=types.PrebuiltVoiceConfig(
                            voice_name='Achird',
                        )
                    )
                ),
            ]
        )
    )
)
```

### Cloud TTS API variant (separate prompt + text fields)

```python
synthesis_input = texttospeech.SynthesisInput(
    text="Votre texte à lire ici",
    prompt="Parlez d'un ton calme et chaleureux, comme un coach bienveillant"
)
voice = texttospeech.VoiceSelectionParams(
    language_code="fr-CA",
    name="Sulafat",
    model_name="gemini-2.5-pro-tts"
)
```

### Temperature

- **Range**: (0.0, 2.0] — exclusive of zero, inclusive of 2.0
- **Default**: 1.0
- **Lower** → more predictable, consistent output (better for production)
- **Higher** → more creative, varied output
- **Availability**: Explicitly supported via **Vertex AI API**. Status unclear for standard Gemini API (a GitHub issue requesting this was closed without resolution)

```python
# Vertex AI example with temperature
config=types.GenerateContentConfig(
    speech_config=types.SpeechConfig(
        language_code="fr-CA",
        voice_config=types.VoiceConfig(
            prebuilt_voice_config=types.PrebuiltVoiceConfig(
                voice_name='Sulafat',
            )
        )
    ),
    temperature=0.8,  # Lower for more consistent therapeutic tone
)
```

### Audio output format

| Property | Value |
|----------|-------|
| Format | PCM 16-bit signed, little-endian |
| Sample rate | 24,000 Hz |
| Channels | Mono |
| MIME type | `audio/L16;codec=pcm;rate=24000` |
| Max duration | ~655 seconds (~10.9 min) per call |
| Watermark | SynthID embedded in all outputs |

### Saving audio to WAV

```python
import wave

def save_wav(filename, pcm_data, channels=1, rate=24000, sample_width=2):
    with wave.open(filename, "wb") as wf:
        wf.setnchannels(channels)
        wf.setsampwidth(sample_width)
        wf.setframerate(rate)
        wf.writeframes(pcm_data)

data = response.candidates[0].content.parts[0].inline_data.data
save_wav('output.wav', data)
```

### Cloud TTS additional output formats

Unary synthesis: `LINEAR16` (default), `ALAW`, `MULAW`, `MP3`, `OGG_OPUS`, `PCM`
Streaming synthesis: `PCM` (default), `ALAW`, `MULAW`, `OGG_OPUS`

---

## 7. Multi-speaker configuration details

Multi-speaker mode supports **exactly 2 speakers maximum**. Speaker names in the config must exactly match those used in the transcript text.

### Transcript format

```
TTS the following conversation between Sophie and Marie:
Sophie: Bonjour Marie, comment te sens-tu aujourd'hui?
Marie: Un peu fatiguée, mais contente d'être ici.
```

### Key rules

- Speaker names in `speakerVoiceConfigs` must be **exact string matches** with names in the text
- You can add per-speaker style guidance in the prompt: `"Make Sophie sound warm and calm, and Marie sound hesitant and tired:"`
- Multi-speaker is available on both Pro and Flash models
- Flash Lite supports **single speaker only**

### Cloud TTS API multi-speaker variant

The Cloud TTS API uses slightly different field names:

```json
{
  "voice": {
    "multiSpeakerVoiceConfig": {
      "speakerVoiceConfigs": [
        { "speakerAlias": "Sophie", "speakerId": "Sulafat" },
        { "speakerAlias": "Marie", "speakerId": "Achernar" }
      ]
    }
  }
}
```

Note the different field names: `speakerAlias` (not `speaker`) and `speakerId` (not `voiceName`).

---

## 8. Best practices, pitfalls, and production tips

### The "three levers" alignment rule

For maximum predictability, ensure **all three components** are semantically consistent:

1. **Style Prompt** — sets the overall emotional tone and delivery character
2. **Text Content** — the semantic meaning of the words must match the requested tone
3. **Markup Tags** — inject specific, localized modifications (not overall tone)

An evocative phrase emotionally consistent with the style prompt produces **much more reliable** results than neutral or contradictory text. Don't rely on tags alone — give the model emotionally rich text to work with.

### Preventing tags from being spoken aloud

This is the most common pitfall. Solutions, in order of effectiveness:

1. **Use style prompts for overall emotion** — move `[happy]`, `[sad]`, `[excited]` into the Director's Notes instead of inline tags
2. **Use action-verb tags** — `[whispering]` (Mode 2, silent) is more reliable than `[whispered]` (may trigger Mode 3)
3. **Break long text into chunks** — long prompts with many tags increase the chance of misfires
4. **Use descriptive natural language** — "React with an amused laugh" is more reliable than just `[laughing]`
5. **Always test new tags** before production — "A tag you assume is a style modifier might be vocalized"

### Chunking long text for reliability

- **Text field limit**: 4,000 bytes per field, 8,000 bytes combined (Cloud TTS API)
- **Max audio output**: ~655 seconds per call
- **Flash model may cut off** at ~5 minutes (known community-reported bug)
- **Style consistency degrades** in very long passages — community reports of voice gender switching mid-generation
- **Best practice**: Generate paragraph-by-paragraph for complex tagged content; use a consistent "style preamble" at the top of every chunk

```python
style_preamble = """
### NOTES DE RÉALISATION
Style : Voix thérapeutique calme et chaleureuse.
Accent : Français québécois de Montréal.
Rythme : Lent et mesuré.

#### TRANSCRIPTION
"""

for paragraph in paragraphs:
    response = client.models.generate_content(
        model="gemini-2.5-pro-preview-tts",
        contents=style_preamble + paragraph,
        config=config
    )
    # Process audio chunk...
```

### ⚠️ IMPORTANT : Générer un seul fichier audio par vidéo, puis découper

**Problème constaté** : Quand on génère plusieurs fichiers TTS séparés (un par section/segment), **la voix change entre les fichiers** — même avec la même voix, le même style prompt et les mêmes paramètres. Le timbre, le rythme et l'intonation varient d'une génération à l'autre. Résultat : les segments ne sonnent pas comme la même personne, ce qui ne passe pas dans un montage vidéo.

**Solution** : Générer le script complet en **un seul appel TTS** (un seul fichier audio), puis **découper le fichier audio** en segments avec un outil comme `ffmpeg`. Cela garantit une voix parfaitement cohérente sur toute la durée.

**Workflow recommandé :**

1. Rédiger le script complet du vidéo en un seul bloc
2. Insérer des `[long pause]` ou `<break time="3s"/>` entre les sections pour faciliter la découpe
3. Générer un seul fichier audio via l'API TTS
4. Découper le fichier audio avec `ffmpeg` (par silence, par timestamps, ou par durée)

```bash
# Découper par détection de silence (pauses de 2s+ entre sections)
ffmpeg -i script_complet.wav -af silencedetect=noise=-30dB:d=2 -f null - 2>&1 | grep silence_end

# Extraire un segment par timestamps
ffmpeg -i script_complet.wav -ss 00:01:23 -to 00:03:45 -c copy segment_02.wav

# Découper en segments de durée fixe (ex: 60 secondes)
ffmpeg -i script_complet.wav -f segment -segment_time 60 -c copy segment_%03d.wav
```

> **Règle d'or** : Un vidéo = un appel TTS = une voix cohérente. Le découpage se fait *après* la génération, jamais avant.

### Consistency across generations

Deterministic, byte-identical output is **not guaranteed** even with identical prompts. To maximize consistency:

- Use **lower temperature** values (via Vertex AI API)
- Use the **Pro model** for better style adherence
- Lock style at the top of every prompt with the same preamble
- Choose a voice whose natural characteristics align with your target (reduces reliance on style overrides)
- Generate multiple takes and select the best one for critical segments

### Common pitfalls summary

| Pitfall | Solution |
|---------|----------|
| Tags spoken aloud as words | Use style prompts for emotions; use Mode 1/2 tags |
| Inconsistent delivery across chunks | Consistent style preamble; same voice; lower temperature |
| Voice gender switching mid-generation | Shorter chunks; explicit voice config |
| Audio cuts off early (Flash) | Use Pro model or chunk into shorter segments |
| Environmental sounds requested | Not supported — only single-speaker vocal sounds |
| Over-tagging reduces naturalness | Leave space for the model to act naturally |
| Mismatched tone and content | Align all three levers: prompt, text, tags |
| SSML tags ignored | Not officially supported; test in your actual deployment environment |
| Minor staccato at extreme speeds | Add pacing hints; avoid maximum-speed settings |

### Pro tips for therapeutic narration apps

- **Sulafat + empathetic style prompt** is the strongest female combination for warm coaching
- Use `[pause]` and `[long pause]` liberally between key therapeutic concepts — silence is powerful
- Write the transcript itself in a calm, reflective style — the model amplifies the text's inherent emotional tone
- For guided meditations, combine `[soft][speaking slowly]` with `<break time="3s"/>` for breathing pauses
- Regenerate individual sentences rather than full scripts when fine-tuning a specific line
- Use explicit pronunciation hints with `<phoneme>` or `<sub>` for Québécois-specific terms that might default to France French pronunciation

---

## 9. Quick-reference parameter cheat sheet

```
┌─────────────────────────────────────────────────────────────────┐
│                    GEMINI TTS API HIERARCHY                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  generateContent(                                               │
│    model = "gemini-2.5-pro-preview-tts"                        │
│    contents = "[style prompt + transcript text]"                │
│    config = GenerateContentConfig(                              │
│      response_modalities = ["AUDIO"]          ← REQUIRED       │
│      speech_config = SpeechConfig(                              │
│        ├─ voice_config = VoiceConfig(         ← single speaker │
│        │    prebuilt_voice_config(                               │
│        │      voice_name = "Sulafat"                            │
│        │    )                                                    │
│        │  )                                                      │
│        └─ multi_speaker_voice_config(         ← multi speaker  │
│             speaker_voice_configs = [                            │
│               SpeakerVoiceConfig(speaker, voice_config),        │
│               SpeakerVoiceConfig(speaker, voice_config)         │
│             ]                                                    │
│           )                                                      │
│      )                                                           │
│      temperature = 0.8                        ← Vertex AI only │
│    )                                                             │
│  )                                                               │
│                                                                 │
│  OUTPUT: PCM 16-bit, 24kHz, mono                               │
│  MAX DURATION: ~655 seconds                                     │
│  MAX SPEAKERS: 2                                                │
│  CONTEXT WINDOW: 32k tokens                                    │
└─────────────────────────────────────────────────────────────────┘
```

## Conclusion

Building effective Gemini TTS for therapeutic apps comes down to **three principles**: choose a voice whose natural traits match your target (Sulafat for warmth, Vindemiatrix for gentleness), write rich style prompts using the Director's Chair framework rather than relying on inline tags for overall tone, and keep your three levers aligned — the style prompt, transcript content, and markup tags should all tell the same emotional story.

The most production-ready approach for French Québec coaching narration is to use the **Pro model** with **Sulafat or Achird**, a detailed French-language style preamble specifying Montréal Québécois accent, paragraph-level chunking with consistent style preambles, and `[pause]`/`[speaking slowly]` tags for pacing — avoiding emotional adjective tags like `[happy]` or `[sad]` inline in favor of Director's Notes. For locale control, use the Cloud TTS or Vertex AI API with explicit `language_code="fr-CA"` rather than relying on auto-detection. SSML tags like `<break>` and `<phoneme>` provide useful supplementary control, but test them thoroughly since they are not officially supported. The Pro model consistently outperforms Flash at interpreting nuanced style prompts — the latency trade-off is worth it for pre-generated therapeutic content.