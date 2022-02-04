const db = require('../storage/database');
const helper = require('../src/helper');
const router = require('express').Router();

let auctions = [];
let dupedIds = [];

const retrievePrices = async function () {
  for (const item of await db.auctions.find()) {
    const auction = {
      id: item.id,
      name: item.auction.name,
      value : item.auction.value
    };
    const index = auctions.findIndex(i => i.id === item.id);

    if (index === -1) auctions.push(auction);
    else auctions[index] = auction;
  }
  dupedIds = [];
  for(const dupe of await db.dupes.find()){
    const item = {
      uuid: dupe.uuid,
      count: dupe.count
    }
    dupedIds.push(item);
  }
};

router.get('/all', async (req, res) => {
  if (auctions.length === 0) {
    return res.status(404).json({
      status: 404,
      data: 'No auctions found.'
    });
  }

  return res.status(200).json({
    status: 200,
    data: auctions
  });
});

router.get('/dupes', async (req, res) => {
  if (dupedIds.length === 0 || dupedIds.length === undefined) {
    return res.status(404).json({
      status: 404,
      data: 'No auctions found.'
    });
  }

  return res.status(200).json({
    status: 200,
    data: dupedIds
  });
});

router.get('/lowestbin/:id', async (req, res) => {
  const id = req.params.id.toUpperCase();
  const item = await db.auctions.findOne({ id: id });

  if (!item) {
    return res.status(404).json({
      status: 404,
      cause: 'Item not found.'
    });
  }

  return res.status(200).json({
    status: 200,
    data: item.auction
  });
});

router.get('/quickStats/:id', async (req, res) => {
  const id = req.params.id.toUpperCase();
  const item = await db.auctions.findOne({ id: id });

  if (!item) {
    return res.status(404).json({
      status: 404,
      cause: 'Item not found.'
    });
  }

  const sales = item.sales.map(i => i.price);

  const stats = {
    average: helper.getAverage(sales),
    median: helper.getMedian(sales),
    min: Math.min(...sales),
    max: Math.max(...sales),
    mode: helper.getMode(sales),
    mean: helper.getMean(sales)
  };

  return res.status(200).json({
    status: 200,
    data: stats
  });
});

retrievePrices();
setInterval(() => retrievePrices(), 60 * 10000);

module.exports = router;
