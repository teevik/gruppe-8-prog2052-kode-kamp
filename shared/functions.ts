function calculatePoints(amountPlayers: number, placement: number) {
  return amountPlayers - (placement - 1);
}

export { calculatePoints };
