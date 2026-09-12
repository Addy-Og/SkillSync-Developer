const express = require("express");
const paymentRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const getStripe = () => {
  return require("stripe")(process.env.STRIPE_SECRET_KEY);
};
//initialized payment
paymentRouter.post("/payment/create-checkout-session", userAuth, async (req, res) => {
  try {
    const origin = req.headers.origin || "http://localhost:5173";
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "SkillSync Premium Membership",
              description: "premium badge!",
            },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/premium`,
      metadata: {
        userId: req.user._id.toString(),
      },
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//payment verify that happen or not
paymentRouter.post("/payment/verify", userAuth, async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) {
      return res.status(400).json({ message: "Session ID is required" });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      const userId = session.metadata.userId;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isPremium: true },
        { new: true }
      ).select("-password");

      return res.json({
        message: "Payment verified successfully",
        user: updatedUser,
      });
    }

    res.status(400).json({ message: "Payment not completed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = paymentRouter;
