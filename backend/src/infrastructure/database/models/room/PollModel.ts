import { PollDocument, PollSchema } from "../../schemas/room/PollSchema";
import { Model, model } from "mongoose";

const PollModel: Model<PollDocument> = model<PollDocument>("Poll", PollSchema);
export default PollModel;
