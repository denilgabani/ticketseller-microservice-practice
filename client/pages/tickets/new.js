import { useState } from "react";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const onBlur = (e) => {
    const curPrice = parseFloat(price);
    if (isNaN(curPrice)) {
      return;
    }

    setPrice(curPrice.toFixed(2));
  };

  return (
    <div>
      <h1>Create a Ticket</h1>

      <form>
        <div className="form-group">
          <label>Title</label>
          <input
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
