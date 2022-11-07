import io from "socket.io-client";
import { URI_MATCHING_SVC } from "../../configs";

export const socket = io(URI_MATCHING_SVC, {
    cors: {
        origin: '*',
      }
});