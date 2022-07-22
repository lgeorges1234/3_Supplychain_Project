// const truffleAssert = require('truffle-assertions');

const SupplyChain = artifacts.require("SupplyChain");

contract("SupplyChain", (accs) => {
  
  const accounts = accs;
  const item =  {
    sku: 1,
    upc: 1,
    originFarmerID: accounts[0],
    originFarmName: "ColombiaCoffee",
    originFarmInformation: "Company from Colombia",
    originFarmLatitude: "3.236498",
    originFarmLongitude: "-73.648118",
    productNotes: "Juicy coffee",
    productPrice: 50,
    itemState: 0,
    distributorID: accounts[1],
    retailerID: accounts[2],
    consumerID: accounts[3],
  }


  it("function fetchItemBufferOne() should return origin coffee data", async () => {
    // create an instance of the SupplyChain contract
    const instance = await SupplyChain.deployed();
    // harvest a new item
    await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );

    // get the data from the fetchItemBufferOne() function
    const resultBufferOne = await instance.fetchItemBufferOne.call(item.upc);
    // check if fetchItemBufferOne() reports the right data
    assert.equal(resultBufferOne[0], item.sku, 'Error: Invalid item SKU')
    assert.equal(resultBufferOne[1], item.upc, 'Error: Invalid item UPC')
    assert.equal(resultBufferOne[2], item.originFarmerID, 'Error: Missing or Invalid ownerID')
    assert.equal(resultBufferOne[3], item.originFarmerID, 'Error: Missing or Invalid originFarmerID')
    assert.equal(resultBufferOne[4], item.originFarmName, 'Error: Missing or Invalid originFarmName')
    assert.equal(resultBufferOne[5], item.originFarmInformation, 'Error: Missing or Invalid originFarmInformation')
    assert.equal(resultBufferOne[6], item.originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude')
    assert.equal(resultBufferOne[7], item.originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude')
  });

  it("function fetchItemBufferTwo() should return origin items data", async () => {
    const instance = await SupplyChain.deployed();  
    // harvest a new item
    await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );
    // get the data from the fetchItemBufferTwo() function
    const resultBufferTwo = await instance.fetchItemBufferTwo.call(item.upc);
    // check if fetchItemBufferTwo() reports the right data
    assert.equal(resultBufferTwo[0], 2, 'Error: Invalid item SKU');
    assert.equal(resultBufferTwo[1], item.upc, 'Error: Invalid item UPC');
    assert.exists(resultBufferTwo[2], 'Error: Missing productID');
    assert.equal(resultBufferTwo[3], item.productNotes, 'Error: Missing or Invalid productNotes')
    assert.equal(resultBufferTwo[4], 0, 'Error: Missing or Invalid productPrice')
    assert.equal(resultBufferTwo[5], item.itemState, 'Error: Missing or Invalid itemState')
    assert.equal(resultBufferTwo[6], "0x0000000000000000000000000000000000000000", 'Error: Missing or Invalid distributorID')
    assert.equal(resultBufferTwo[7], "0x0000000000000000000000000000000000000000", 'Error: Missing or Invalid retailerID')
    assert.equal(resultBufferTwo[8], "0x0000000000000000000000000000000000000000", 'Error: Missing or Invalid consumerID')
  });

  it("function harvestItem() should harvest a new item", async () => {
    const instance = await SupplyChain.deployed();
    // the farmer harvest a new item
    const result = await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );
    // get the data from the blockchain thanks to fetchItemBufferOne() and fetchItemBufferTwo()
    const resultBufferOne = await instance.fetchItemBufferOne.call(item.upc);
    const resultBufferTwo = await instance.fetchItemBufferTwo.call(item.upc);
    // check if the item has been correctly recorded into the blockchain
    assert.equal(resultBufferOne[0], 3, 'Error: Invalid item SKU');
    assert.equal(resultBufferOne[1], item.upc, 'Error: Invalid item UPC');
    assert.equal(resultBufferOne[2], item.originFarmerID, 'Error: Missing or Invalid ownerID');
    assert.equal(resultBufferOne[3], item.originFarmerID, 'Error: Missing or Invalid originFarmerID');
    assert.equal(resultBufferOne[4], item.originFarmName, 'Error: Missing or Invalid originFarmName');
    assert.equal(resultBufferOne[5], item.originFarmInformation, 'Error: Missing or Invalid originFarmInformation');
    assert.equal(resultBufferOne[6], item.originFarmLatitude, 'Error: Missing or Invalid originFarmLatitude');
    assert.equal(resultBufferOne[7], item.originFarmLongitude, 'Error: Missing or Invalid originFarmLongitude');
    assert.equal(resultBufferTwo[3], item.productNotes, "Error: Invalid productNotes");
    assert.equal(resultBufferTwo[5], item.itemState, 'Error: Invalid item State');
    // truffleAssert.eventEmitted(harvestSupplyChain, 'Harvested');
    // check if the related event has been emitted
    assert.equal(result.logs[0].event, "Harvested", "Error: event 'Harvested' not emitted");
  });

  it("function processItem() should process an harvested item", async () =>{
    // init a new supply chain
    const instance = await SupplyChain.deployed();
    await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );
    // the farmer process an harvested item
    const result  = await instance.processItem(item.upc, { from:item.originFarmerID });
    // get the data from the blockchain thanks to fetchItemBufferTwo()
    const resultBufferTwo = await instance.fetchItemBufferTwo.call(item.upc)
    // check if the product's state has changed to 'Process' and the joined event has been emitted
    assert.equal(resultBufferTwo[5], 1, 'Error: Invalid item State')
    assert.equal(result.logs[0].event, "Processed", "Error: event 'Processed' not emitted")
  })

  it("function packItem() should pack a processed item", async () =>{
    // init a new supply chain
    const instance = await SupplyChain.deployed();
    await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );
    await instance.processItem(item.upc, { from:item.originFarmerID });
    // the farmer pack a processed item
    const result = await instance.packItem(item.upc, { from:item.originFarmerID });
    // get the data from the blockchain thanks to fetchItemBufferTwo()
    const resultBufferTwo = await instance.fetchItemBufferTwo.call(item.upc);
    // check if the product's state has changed to 'Pack' and the joined event has been emitted
    assert.equal(resultBufferTwo[5], 2, 'Error: Invalid item State')
    assert.equal(result.logs[0].event, "Packed", "Error: event 'Packed' not emitted")
  });

  it("function sellItem() should sell a packed item", async () =>{
    // init a new supply chain
    const instance = await SupplyChain.deployed();
    await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );
    await instance.processItem(item.upc, { from:item.originFarmerID });
    await instance.packItem(item.upc, { from:item.originFarmerID });
    // a farmer sell a packed item
    const result = await instance.sellItem(item.upc, item.productPrice, { from:item.originFarmerID });
    // get the data from the blockchain thanks to fetchItemBufferTwo()
    const resultBufferTwo = await instance.fetchItemBufferTwo.call(item.upc);
    // check if the product's state has changed to 'ForSale, price has been set and the joined event has been emitted
    assert.equal(resultBufferTwo[5], 3, 'Error: Invalid item State');
    assert.equal(resultBufferTwo[4], item.productPrice, 'Error: Invalid item price');
    assert.equal(result.logs[0].event, "ForSale", "Error: event 'ForSale' not emitted")
  });

  it("function buyItem() should buy a for sale item", async () =>{
    // init a new supply chain
    const instance = await SupplyChain.deployed();
    await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );
    await instance.processItem(item.upc, { from:item.originFarmerID,});
    await instance.packItem(item.upc, { from:item.originFarmerID });
    await instance.sellItem(item.upc, item.productPrice, { from:item.originFarmerID });
    // get the balance of the seller before the transaction
    const balanceFarmerBeforeTransaction = await web3.eth.getBalance(item.originFarmerID);
    // a distributor buy a ForSale item from the farmer
    const result = await instance.buyItem(item.upc, { from:item.distributorID, value: item.productPrice });
    // get the balance of the seller after the transaction
    let balanceFarmerAfterTransaction = await web3.eth.getBalance(item.originFarmerID);
    // calculate  the difference between the two balances
    const balanceDifference = BigInt(balanceFarmerAfterTransaction) - BigInt(balanceFarmerBeforeTransaction);
    // get the data from the blockchain thanks to fetchItemBufferTwo()
    const resultBufferTwo = await instance.fetchItemBufferTwo.call(item.upc);
    // check if the product's state has been changed to sold, the distributor's address recorded and the joined event emitted
    assert.equal(resultBufferTwo[5], 4, 'Error: Invalid item State');
    assert.equal(resultBufferTwo[6], item.distributorID, 'Error: Invalid distributor address');
    assert.equal(result.logs[0].event, "Sold", "Error: event 'Sold' not emitted");
    // check if the farmer has received the money
    assert.equal(balanceDifference, item.productPrice, "Error: Sold after transaction is wrong")
  });

  it("function shipItem() should ship a saled item", async () =>{
    // init a new supply chain
    const instance = await SupplyChain.deployed();
    await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );
    await instance.processItem(item.upc, { from:item.originFarmerID });
    await instance.packItem(item.upc, { from:item.originFarmerID });
    await instance.sellItem(item.upc, item.productPrice, { from:item.originFarmerID });
    await instance.buyItem(item.upc, { from:item.distributorID, value: item.productPrice });
    // a farmer ship a sold item to a retailer
    const result = await instance.shipItem(item.upc, { from:item.distributorID });
    // get the data from the blockchain thanks to fetchItemBufferTwo()
    const resultBufferTwo = await instance.fetchItemBufferTwo.call(item.upc);
    // check if the state has changed to 'Shipped' and the joined event has been emitted
    assert.equal(resultBufferTwo[5], 5, 'Error: Invalid item State');
    assert.equal(result.logs[0].event, "Shipped", "Error: event 'Shipped' not emitted")
  });

  it("function receiveItem() should receive a shipped item", async () =>{
    // init a new supply chain
    const instance = await SupplyChain.deployed();
    await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );
    await instance.processItem(item.upc, { from:item.originFarmerID });
    await instance.packItem(item.upc, { from:item.originFarmerID });
    await instance.sellItem(item.upc, item.productPrice, { from:item.originFarmerID });
    await instance.buyItem(item.upc, { from:item.distributorID, value: item.productPrice });
    await instance.shipItem(item.upc, { from:item.distributorID });
    // a retailer receive a shipped item from a distributor
    const result = await instance.receiveItem(item.upc, { from:item.retailerID });
    // get the data from the blockchain thanks to fetchItemBufferTwo()
    const resultBufferTwo = await instance.fetchItemBufferTwo.call(item.upc);
    // check if the product's state has changed to 'Received', retailer address has been recorded and the joined event has been emitted
    assert.equal(resultBufferTwo[5], 6, 'Error: Invalid item State');
    assert.equal(resultBufferTwo[7], item.retailerID, 'Error: invalid retailer address')
    assert.equal(result.logs[0].event, "Received", "Error: event 'Shipped' not emitted")
  });

  it("function purchaseItem() should purchase a received item", async () =>{
    // init a new supply chain
    const instance = await SupplyChain.deployed();
    await instance.harvestItem(
      item.upc,
      item.originFarmerID,
      item.originFarmName,
      item.originFarmInformation,
      item.originFarmLatitude,
      item.originFarmLongitude,
      item.productNotes,
    );
    await instance.processItem(item.upc, { from:item.originFarmerID });
    await instance.packItem(item.upc, { from:item.originFarmerID });
    await instance.sellItem(item.upc, item.productPrice, { from:item.originFarmerID });
    await instance.buyItem(item.upc, { from:item.distributorID, value: item.productPrice });
    await instance.shipItem(item.upc, { from:item.distributorID });
    await instance.receiveItem(item.upc, { from:item.retailerID });
    // a consumer purchase a received item from a retailer
    const result = await instance.purchaseItem(item.upc, { from:item.consumerID });
    // get the data from the blockchain thanks to fetchItemBufferTwo()
    const resultBufferTwo = await instance.fetchItemBufferTwo.call(item.upc);
    // check if the product's state has changed to 'Purchased', consumer address has been recorded and the joined event has been emitted
    assert.equal(resultBufferTwo[5], 7, 'Error: Invalid item State');
    assert.equal(resultBufferTwo[8], item.consumerID, 'Error: invalid consumer address')
    assert.equal(result.logs[0].event, "Purchased", "Error: event 'Purchased' not emitted")
  });
});
