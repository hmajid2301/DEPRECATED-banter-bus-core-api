async function teardown() {
  await (global as any).__MONGOD__.stop();
}

export default teardown;
