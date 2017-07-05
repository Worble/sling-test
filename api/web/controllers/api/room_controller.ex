defmodule Sling.RoomController do
  use Sling.Web, :controller

  alias Sling.Room

  plug Guardian.Plug.EnsureAuthenticated, handler: Sling.SessionController

  def index(conn, params) do
    page =
      Sling.Room
        |> order_by([desc: :inserted_at, desc: :id])
        |> Sling.Repo.paginate(params)

    render(conn, "index.json", page: page)
  end

  def create(conn, params) do
    current_user = Guardian.Plug.current_resource(conn)
    changeset = Room.changeset(%Room{}, params)

    case Repo.insert(changeset) do
      {:ok, room} ->
        assoc_changeset = Sling.UserRoom.changeset(
          %Sling.UserRoom{},
          %{user_id: current_user.id, room_id: room.id}
        )
        Repo.insert(assoc_changeset)

        conn
        |> put_status(:created)
        |> render("show.json", room: room)
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Sling.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def join(conn, %{"id" => room_id}) do
    current_user = Guardian.Plug.current_resource(conn)
    room = Repo.get(Room, room_id)

    changeset = Sling.UserRoom.changeset(
      %Sling.UserRoom{},
      %{room_id: room.id, user_id: current_user.id}
    )

    case Repo.insert(changeset) do
      {:ok, _user_room} ->
        conn
        |> put_status(:created)
        |> render("show.json", %{room: room})
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Sling.ChangesetView, "error.json", changeset: changeset)
    end
  end

  def leave(conn, %{"id" => room_id}) do
    current_user = Guardian.Plug.current_resource(conn)
    room = Repo.get(Room, room_id)

    user_room = Repo.get_by(Sling.UserRoom, room_id: room.id, user_id: current_user.id)

    case Repo.delete(user_room) do
      {:ok, struct} ->
        if Repo.one(from r in Sling.UserRoom, where: r.room_id == ^room.id, select: count("*")) < 1 do
          Repo.delete(room)
          conn
          |> put_status(:ok)
          |> render("room_deleted.json", user_room: struct)
        else
          conn
          |> put_status(:ok)
          |> render("delete.json", user_room: struct)
        end
      {:error, changeset} ->
        conn
        |> put_status(:unprocessable_entity)
        |> render(Sling.ChangesetView, "error.json", changeset: changeset)
    end    
  end
end