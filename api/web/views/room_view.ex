defmodule Sling.RoomView do
  use Sling.Web, :view

  def render("index.json", %{page: page}) do
    %{
      data: render_many(page.entries, Sling.RoomView, "room.json"),
      pagination: Sling.PaginationHelpers.pagination(page)
    }
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

  def render("room_deleted.json", %{user_room: user_room}) do
    %{ok: true,
      deleted: true,
      id: user_room.id,
      room_id: user_room.room_id,
      user_id: user_room.user_id}
  end
end
