import { NextResponse } from "next/server";
import Midtrans from 'midtrans-client';
import axios from "axios";

let snap = new Midtrans.Snap({
    isProduction: false,
    serverKey: process.env.SERVER_KEY,
    clientKey: process.env.NEXT_PUBLIC_CLIENT_KEY,
});


export async function POST(req) {

    const data = await req.json();
    if(data.length === 0) {
        throw new Error("data not found");
    }

    const itemDetails = data.map((item) => {
        return {
            key: item.id,
            id: item.id,
            name: item.name,
            price: _.ceil(parseFloat(item.price.toString())),
            quantity: item.quantity,
        }
    });

    const grossAmount = _.sumBy(
        itemDetails,
        (item) => item.price * item.quantity
    );

    const orderId = _.random(100000, 999999);

    const parameter = {
        item_details: [itemDetails],
        transaction_details: {
            order_id: orderId,
            gross_amount: grossAmount,
        }
    }

    const token = await snap.createTransactionToken(parameter);

    return NextResponse.json({
        token,
        orderId
    })
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('order_id');
  
    if (!orderId) {
      return NextResponse.json({ error: 'Missing order_id' }, { status: 400 });
    }
  
    const serverKey = process.env.SERVER_KEY;
    const base64Key = Buffer.from(`${serverKey}:`).toString('base64');
  
    try {
      const res =  await axios
                .get(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                      'Authorization': `Basic ${base64Key}`
                  }
                })
                .then((res) => {
                  console.log(res.data);
                })
                .catch((err) => {
                  console.log(err);
                });
  
      if (!res.ok) {
        const errorData = await res.json();
        return NextResponse.json({ error: 'Failed to fetch status', details: errorData }, { status: res.status });
      }
  
      const data = await res.json();
  
      return NextResponse.json(data);
    } catch (error) {
      return NextResponse.json({ error: 'Unexpected server error', details: error }, { status: 500 });
    }
  }