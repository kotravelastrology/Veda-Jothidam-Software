const { attachSource } = require('../contracts/chartContext');

const BPHS_CHART_QUALITY_SOURCE = {
  title: 'Brihat Parashara Hora Shastra (BPHS)',
  author: 'R. Santhanam (translation)',
  file: 'C23_BPHS_Santhanam.pdf',
  tradition: 'Parashari',
  convention: 'Chart Quality Assessment, Ch.2-4, Ch.26-27, Ch.31-38',
  pageLocus: 'file pages TBD / printed pages TBD — S11-E',
};

function calculateChartQuality(yogaResult, planetaryStrengths) {
  // Phase 11: Calculate chart quality metrics aggregating all prior phases
  if (!yogaResult || !yogaResult.yogas) {
    return attachSource({
      index: 0,
      rating: 'DIFFICULT',
      breakdown: 'No yoga data available for quality assessment',
      components: {
        yogaStrengthScore: 0,
        planetaryStrengthScore: 0,
        beneficRatio: -5,
        cancellationBonus: 0
      },
      summary: {
        totalYogas: 0,
        criticalYogas: 0,
        majorYogas: 0,
        moderateYogas: 0,
        minorYogas: 0,
        cancelledYogas: 0,
        averagePlanetaryStrength: 0,
        beneficPercentage: 0,
        maleficPercentage: 0
      }
    }, BPHS_CHART_QUALITY_SOURCE);
  }

  const yogas = yogaResult.yogas;

  // Step 1: Calculate Yoga Strength Score (0-40)
  const yogaCounts = {
    CRITICAL: 0,
    MAJOR: 0,
    MODERATE: 0,
    MINOR: 0,
    NEGLIGIBLE: 0,
    CANCELLED: 0
  };

  yogas.forEach(yoga => {
    if (yoga.cancelled) {
      yogaCounts.CANCELLED++;
    } else if (yoga.severity) {
      yogaCounts[yoga.severity.rating]++;
    }
  });

  const yogaStrengthScore = Math.min(40, (
    yogaCounts.CRITICAL * 10 +
    yogaCounts.MAJOR * 5 +
    yogaCounts.MODERATE * 2
  ));

  // Step 2: Calculate Planetary Strength Score (0-35)
  let averagePlanetaryStrength = 0;
  if (planetaryStrengths && Object.keys(planetaryStrengths).length > 0) {
    let totalStrength = 0;
    let count = 0;
    Object.values(planetaryStrengths).forEach(planet => {
      if (planet.totalStrength !== undefined) {
        totalStrength += planet.totalStrength;
        count++;
      }
    });
    averagePlanetaryStrength = count > 0 ? totalStrength / count : 0;
  }

  const planetaryStrengthScore = (averagePlanetaryStrength / 100) * 35;

  // Step 3: Calculate Benefic/Malefic Ratio (−5 to 15)
  let beneficCount = 0;
  let adverseCount = 0;
  const beneficYogaNames = new Set([
    'Sunapha Yoga', 'Anapha Yoga', 'Vesi Yoga', 'Vosi Yoga',
    'Adhi Yoga', 'Ruchaka Yoga', 'Bhadra Yoga', 'Hamsa Yoga',
    'Malavya Yoga', 'Sasa Yoga'
  ]);

  yogas.forEach(yoga => {
    if (!yoga.cancelled && yoga.severity) {
      if (yoga.severity.rating === 'CRITICAL' || yoga.severity.rating === 'MAJOR') {
        if (beneficYogaNames.has(yoga.name)) {
          beneficCount += yoga.severity.score;
        } else {
          adverseCount += yoga.severity.score;
        }
      }
    }
  });

  const totalSeverity = beneficCount + adverseCount;
  let beneficRatio = 0;
  if (totalSeverity > 0) {
    const beneficPercentage = (beneficCount / totalSeverity) * 100;
    beneficRatio = (beneficPercentage / 100) * 15;
  }

  if (adverseCount > beneficCount) {
    beneficRatio = -5;  // Penalty for malefic dominance
  }

  // Step 4: Calculate Cancellation Bonus (0-10)
  const totalYogas = yogas.length - yogaCounts.CANCELLED;
  let cancellationBonus = 0;
  if (totalYogas > 0) {
    const cancellationRatio = yogaCounts.CANCELLED / yogas.length;
    cancellationBonus = cancellationRatio * 10;
  }

  // Step 5: Calculate Chart Quality Index (0-100)
  const chartQualityIndex = Math.max(0, Math.min(100, (
    yogaStrengthScore +
    planetaryStrengthScore +
    beneficRatio +
    cancellationBonus
  )));

  // Step 6: Assign Rating Tier
  let rating = 'DIFFICULT';
  if (chartQualityIndex >= 85) rating = 'EXCEPTIONAL';
  else if (chartQualityIndex >= 70) rating = 'VERY_GOOD';
  else if (chartQualityIndex >= 55) rating = 'GOOD';
  else if (chartQualityIndex >= 40) rating = 'AVERAGE';
  else if (chartQualityIndex >= 25) rating = 'CHALLENGING';

  // Step 7: Generate breakdown explanation
  let breakdown = '';
  if (rating === 'EXCEPTIONAL') {
    breakdown = 'Chart with exceptional potential - multiple strong yogas and excellent planetary support';
  } else if (rating === 'VERY_GOOD') {
    breakdown = 'Chart with strong foundational yogas and above-average planetary support';
  } else if (rating === 'GOOD') {
    breakdown = 'Solid chart foundation with benefic yogas and adequate planetary strength';
  } else if (rating === 'AVERAGE') {
    breakdown = 'Normal chart with mixed yogas - success requires focused effort';
  } else if (rating === 'CHALLENGING') {
    breakdown = 'Chart with significant challenges - obstacles present but surmountable';
  } else {
    breakdown = 'Difficult chart - significant obstacles and weak planetary support';
  }

  // Summary statistics
  const beneficPercentage = totalSeverity > 0 ? Math.round((beneficCount / totalSeverity) * 100) : 0;
  const maleficPercentage = totalSeverity > 0 ? Math.round((adverseCount / totalSeverity) * 100) : 0;

  return attachSource({
    index: Math.round(chartQualityIndex * 10) / 10,
    rating,
    breakdown,
    components: {
      yogaStrengthScore: Math.round(yogaStrengthScore * 10) / 10,
      planetaryStrengthScore: Math.round(planetaryStrengthScore * 10) / 10,
      beneficRatio: Math.round(beneficRatio * 10) / 10,
      cancellationBonus: Math.round(cancellationBonus * 10) / 10
    },
    summary: {
      totalYogas: yogas.length,
      criticalYogas: yogaCounts.CRITICAL,
      majorYogas: yogaCounts.MAJOR,
      moderateYogas: yogaCounts.MODERATE,
      minorYogas: yogaCounts.MINOR,
      negligibleYogas: yogaCounts.NEGLIGIBLE,
      cancelledYogas: yogaCounts.CANCELLED,
      averagePlanetaryStrength: Math.round(averagePlanetaryStrength * 10) / 10,
      beneficPercentage,
      maleficPercentage
    }
  }, BPHS_CHART_QUALITY_SOURCE);
}

module.exports = {
  calculateChartQuality,
  BPHS_CHART_QUALITY_SOURCE,
};
