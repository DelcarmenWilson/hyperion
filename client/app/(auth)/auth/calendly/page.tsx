"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import dotenv from "dotenv";

const CalendlyAuthPage = () => {
  dotenv.config();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const id = "E1So8pVERZerhvXZEQu7ZLabfgcjhQtQswzBr9HlhwA";
  const secret = "lAS1wVSLqUezeZGwNw-vRWkZVQTjmiF-GHFqIs7seJI";
  // const username =
  //   "E1So8pVERZerhvXZEQu7ZLabfgcjhQtQswzBr9HlhwA:lAS1wVSLqUezeZGwNw-vRWkZVQTjmiF-GHFqIs7seJI";
  const key = `${id}:${secret}`;
  const base64String = Buffer.from(key).toString("base64");

  const tokenOptions = {
    method: "POST",
    url: "https://auth.calendly.com/oauth/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${base64String}`,
    },
    data: {},
    params: {
      grant_type: "authorization_code",
      code,
      redirect_uri: "http://localhost:3000/auth/calendly",
    },
  };

  const webhookOptions = {
    method: "POST",
    url: "https://api.calendly.com/webhook_subscriptions",
    headers: { "Content-Type": "application/json", Authorization: "" },
    data: {
      url: "https://blah.foo/bar",
      events: [
        "invitee.created",
        "invitee.canceled",
        "invitee_no_show.created",
        "invitee_no_show.deleted",
      ],
      user: "https://api.calendly.com/users/BBBBBBBBBBBBBBBB",
      scope: "user",
      signing_key: "5mEzn9C-I28UtwOjZJtFoob0sAAFZ95GbZkqj4y3i0I",
    },
  };

  // const baseUrl = "";

  useEffect(() => {
    if (!code) return;
    console.log(key);

    axios
      .request(tokenOptions)
      .then(function (response) {
        const { access_token, owner, organization } = response.data;
        console.log(access_token, owner, organization);
        const webhookOptions = {
          method: "POST",
          url: "https://api.calendly.com/webhook_subscriptions",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
          data: {
            url: "https://insect-pro-luckily.ngrok-free.app/integrations/calendly",
            events: [
              "invitee.created",
              "invitee.canceled",
              "invitee_no_show.created",
              "invitee_no_show.deleted",
            ],
            user: owner,
            organization,
            scope: "user",
            signing_key: "ioqXd06CiTLsPwbjqsVkXMEW7Forru5DworYP1lbnpY",
          },
        };

        axios
          .request(webhookOptions)
          .then(function (response) {
            console.log(response.data);
          })
          .catch(function (error) {
            console.error(error);
          });
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [code]);
  return <div>{code}</div>;
};

export default CalendlyAuthPage;
