# PSI Voice Audio Files

Place your 9 recorded audio files in this folder named:
- `month-1.mp3`
- `month-2.mp3`
- `month-3.mp3`
- `month-4.mp3`
- `month-5.mp3`
- `month-6.mp3`
- `month-7.mp3`
- `month-8.mp3`
- `month-9.mp3`

## Recommended MP3 Export Settings for Cambodian Mobile Data:
To ensure audio loads instantly and uses minimal phone data (< 1 MB per message):
- **Channel**: Mono (1 channel — speech does not require stereo, cuts file size by 50%)
- **Bitrate**: 64 kbps Constant Bitrate (CBR) (or 48 kbps for ultra-lightweight)
- **Sample Rate**: 32,000 Hz or 44,100 Hz
- **Typical 2-minute message size**: ~960 KB at 64 kbps mono (fast load even on 2G/3G)

### Quick FFmpeg Command:
```bash
ffmpeg -i source_month_1.wav -c:a libmp3lame -b:a 64k -ac 1 -ar 32000 month-1.mp3
```
