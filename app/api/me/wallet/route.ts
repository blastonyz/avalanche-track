import { NextRequest } from "next/server";
import { AppError, json, run } from "@/lib/api";
import { requireUser } from "@/lib/auth";
import { UserModel } from "@/lib/models/User";

export const dynamic = "force-dynamic";

/** ¿Tiene wallet registrada? */
export const GET = (req: NextRequest) =>
  run(req, false, async () => {
    const u = await requireUser();
    return json({ wallet: u.wallet ?? "", registered: !!u.wallet });
  });

/**
 * Registra la wallet conectada solo si el perfil la tiene vacía.
 * El update es atómico (filtra wallet vacía), así que nunca pisa una ya guardada.
 */
export const POST = (req: NextRequest) =>
  run(req, true, async () => {
    const u = await requireUser();
    const b = (await req.json().catch(() => ({}))) as { address?: unknown };
    const address = typeof b.address === "string" ? b.address.trim() : "";
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) throw new AppError("wallet");

    const r = await UserModel.updateOne({ _id: u._id, wallet: { $in: ["", null] } }, { $set: { wallet: address } });
    const wallet = r.modifiedCount ? address : (u.wallet ?? "");
    return json({ wallet, registered: r.modifiedCount === 1 });
  });
