const webpush = require("web-push");
const NotificationSubscriptionRepository = require("../repository/NotificationSubscriptionRepository");
const NotificationRepository = require("../repository/NotificationRepository");

const logo_url = "https://res.cloudinary.com/daimddpvp/image/upload/v1760450608/logo-white_odlyob.png";
const defaultPayload = {
  icon:logo_url, badge: logo_url, image: logo_url, vibrate: [100, 50, 100]
}

class PaymentController {
  #notificationSubscriptionRepository;
  #notificationRepository;

  constructor() {
    this.#notificationSubscriptionRepository =
      new NotificationSubscriptionRepository();
    this.#notificationRepository = new NotificationRepository();

    this.detectSubscription = this.detectSubscription.bind(this);
    this.sendToAll = this.sendToAll.bind(this);
    this.sendToUsers = this.sendToUsers.bind(this);
    this.sendToVets = this.sendToVets.bind(this);
    this.sendToPetOwners = this.sendToPetOwners.bind(this);
    this.sendToUserBooking = this.sendToUserBooking.bind(this);
    this.getUnconfirmedNotifications = this.getUnconfirmedNotifications.bind(this);
    this.putConfirmNotification = this.putConfirmNotification.bind(this);
    this.putConfirmAllNotifications = this.putConfirmAllNotifications.bind(this);
  }
  async detectSubscription(req, res) {
    try {
      const { sub, userId } = req.body;
      const existingSub =
        await this.#notificationSubscriptionRepository.findSubscriptionByEndpointId(
          sub.endpoint
        );
      if (existingSub) {
        console.log(existingSub);
        if (existingSub.userId === userId) {
          return res
            .status(200)
            .json({ ok: true, message: "Subscription already exists" });
        }
        await this.#notificationSubscriptionRepository.update(existingSub.id, {
          userId,
        });
        return res
          .status(200)
          .json({ ok: true, message: "Subscription updated" });
      }
      await this.#notificationSubscriptionRepository.create({
        endpoint: sub.endpoint,
        keys: sub.keys,
        userId,
      });
      res.status(201).json({ ok: true, message: "Subscribed successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: "Error subscribing status",
        error: error.message,
      });
    }
  }

  async getUnconfirmedNotifications(req, res) {
    try {
      const { userId } = req.params;
      const notifications = await this.#notificationRepository.findUnconfirmedByUserId(userId);
      res.status(200).json({ ok: true, data: notifications, message: "Got notifications" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: "Error getting status",
        error: error.message,
      });
    }
  }

  async putConfirmNotification(req, res) {
    try {
      const { id } = req.body;
      const notification = await this.#notificationRepository.update(id, { confirmed: true });
      res.status(200).json({ ok: true, data: notification, message: "Notification confirmed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: "Error confirming notification",
        error: error.message,
      });
    }
  }

  async putConfirmAllNotifications(req, res) {
    try {
      const { userId } = req.body;
      const notification = await this.#notificationRepository.updateAllNotifications(userId);
      res.status(200).json({ ok: true, data: notification, message: "Notification confirmed" });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        message: "Error confirming notification",
        error: error.message,
      });
    }
  }

  async sendToAll(req, res) {
    const payload = req.body;
    const subs = await this.#notificationSubscriptionRepository.findAll();
    let ok = 0,
      fail = 0;
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: s.keys },
            JSON.stringify({...payload, ...defaultPayload})
          );
          ok++;
        } catch (err) {
          // 404/410 => gone
          if (err && (err.statusCode === 404 || err.statusCode === 410)) {
            await this.repo.remove(s.endpoint);
          }
          fail++;
        }
      })
    );
    res.status(200).json({
      ok: true,
      message: "sent notifications",
    });
  }

  async sendToUsers(userIds, payload) {
    const subs = await this.#notificationSubscriptionRepository.findByUserIds(
      userIds
    );
    let ok = 0,
      fail = 0;
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: s.keys },
            JSON.stringify({...payload, ...defaultPayload})
          );
          await this.#notificationRepository.create({
            userId: s.userId,
            message: payload.title,
            confirmed: false,
          });
          ok++;
        } catch (err) {
          // 404/410 => gone
          if (err && (err.statusCode === 404 || err.statusCode === 410)) {
          }
          fail++;
        }
      })
    );

    return { ok, fail };
  }

  async sendToUserBooking(bookingIds, payload, role) {
    const subs = await this.#notificationSubscriptionRepository.findByBookingIds(
      bookingIds, role
    );
    let ok = 0,
      fail = 0;
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: s.keys },
            JSON.stringify({...payload, ...defaultPayload})
          );
          await this.#notificationRepository.create({
            userId: s.userId,
            message: payload.title,
            confirmed: false,
          });
          ok++;
        } catch (err) {
          // 404/410 => gone
          if (err && (err.statusCode === 404 || err.statusCode === 410)) {
            // await this.repo.remove(s.endpoint);
          }
          fail++;
        }
      })
    );

    return { ok, fail };
  }

  async sendToVets(vetIds, payload) {
    const subs = await this.#notificationSubscriptionRepository.findByVetIds(
      vetIds
    );
    let ok = 0,
      fail = 0;
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: s.keys },
            JSON.stringify({...payload, ...defaultPayload})
          );
          await this.#notificationRepository.create({
            userId: s.userId,
            message: payload.title,
            confirmed: false,
          }); 
          ok++;
        } catch (err) {
          // 404/410 => gone
          if (err && (err.statusCode === 404 || err.statusCode === 410)) {
            // await this.repo.remove(s.endpoint);
          }
          fail++;
        }
      })
    );

    return { ok, fail };
  }

  async sendToPetOwners(petIds, payload) {
    const subs = await this.#notificationSubscriptionRepository.findByPetIds(
      petIds
    );
    let ok = 0,
      fail = 0;
    
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: s.keys },
            JSON.stringify({...payload, ...defaultPayload})
          );
          await this.#notificationRepository.create({
            userId: s.userId,
            message: payload.title,
            confirmed: false,
          }); 
          ok++;
        } catch (err) {
          // 404/410 => gone
          if (err && (err.statusCode === 404 || err.statusCode === 410)) {
            // await this.repo.remove(s.endpoint);
          }
          fail++;
        }
      })
    );

    return { ok, fail };
  }
}

module.exports = PaymentController;
