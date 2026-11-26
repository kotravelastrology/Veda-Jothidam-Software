/** Says that what the card shows was calculated on this device because the server could not be reached (src/offline/localEngine.ts). */
export function DeviceChip({ className = '' }: { className?: string }) {
  return (
    <p className={`rounded-lg bg-saffron-soft px-2.5 py-1 text-[11px] text-ink ${className}`} role="status" data-testid="computed-on-device">
      📴 இணைப்பு இல்லை: இந்தச் சாதனத்திலேயே கணக்கிட்டது (சேவையகத்தின் அதே கணிப்பு, அதே தரவு)
    </p>
  );
}
