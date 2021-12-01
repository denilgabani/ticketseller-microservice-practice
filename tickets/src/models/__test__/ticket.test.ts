import { Ticket } from "../Ticket";

it("checks optimistic concurrency control", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "first ticket",
    price: 202,
    userId: "12345",
  });

  //   Save the ticket in db
  await ticket.save();

  //fetch ticket twice from db
  const ticketInstanceOne = await Ticket.findById(ticket.id);
  const ticketInstanceTwo = await Ticket.findById(ticket.id);

  //   Make two seperate changes to both of the instances
  ticketInstanceOne!.set({ price: 10 });
  ticketInstanceTwo!.set({ price: 20 });

  //save the first fetched ticket in db again
  await ticketInstanceOne!.save();

  //   When first ticket saved after update then version already has been updated
  // Now if we try to save second instance of ticket it should give error in catch block
  //   as the second instance now has outdated version

  try {
    await ticketInstanceTwo!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point of test case");
});

it("increase the version every time ticket save or updates", async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: "first ticket",
    price: 202,
    userId: "12345",
  });

  //   Save the ticket in db
  await ticket.save();

  expect(ticket.version).toEqual(0);

  await ticket.save();
  expect(ticket.version).toEqual(1);

  await ticket.save();
  expect(ticket.version).toEqual(2);
});
