const constants = {
  ms: {
    hour: 60 * 60 * 1000,
    day: 86400000,
  },

  dlrChargesPercentage: 0.15, // 15% of Total Bill Amount
  lateFeesPercentage: 0.015, // 1.5% of (deliveryCharges - rentalCharges)
  cancellationChargesRates: [
    {
      period: 60 * 60 * 1000 * 24,
      chargeType: "percentage", // "flat" or "percentage"
      charges: 0.03, // 3% of Total bill Amount
    },
    {
      period: 60 * 60 * 1000 * 12,
      chargeType: "percentage", // "flat" or "percentage"
      charges: 0.06, // 6% of Total bill Amount
    },
  ],
  taxRates: 0.1, // 10% of Total Bill Amount

  pageCount: 30,
  pageSkip: 0,

  maxDistance: 10,
  hirePeriod: 86400000,

  dayDiff: {
    min: 0, // 30
    max: 30, // 90
  },
  maxAge: 6,

  colorCodes: {
    expired: "#FF6C00",
    willExpire: "#00BE75",

    ongoing: "#FF6C00",
    upcoming: "#00BE75",
  },

  docType: "proofOfIncorporation",

  item: "trailer",
  delivery: "door2door",

  minHours: 2,

  approvalEnum: {
    pending: 0,
    approved: 1,
    rejected: 2,
  },

  daysMapping: {
    sunday: "SUN",
    monday: "MON",
    tuesday: "TUE",
    wednesday: "WED",
    thursday: "THU",
    friday: "FRI",
    saturday: "SAT",
  },

  maxPictureSize: 1048576 * 200, // 200MB
  maxNumberOfPictures: 5,

  allowedfiles: {
    documents: ["image/jpeg", "image/jpg", "image/png", "application/pdf"],
    excelDocuments: [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ],
  },
};

module.exports = constants;
