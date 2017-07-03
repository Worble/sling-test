defmodule Sling.RoomView do
  use Sling.Web, :view

  def render("index.json", %{rooms: rooms}) do
    %{data: render_many(rooms, Sling.RoomView, "room.json")}
  end

  def render("show.json", %{room: room}) do
    %{data: render_one(room, Sling.RoomView, "room.json")}
  end

  def render("room.json", %{room: room}) do
    %{id: room.id,
      name: room.name,
      topic: room.topic}
  end

  def render("delete.json", %{user_room: user_room}) do
    %{ok: true,
      id: user_room.id,
      room_id: user_room.room_id,
      user_id: user_room.user_id}
  end
end
