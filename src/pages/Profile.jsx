import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-3xl bg-white p-10 shadow-xl">
        <h1 className="mb-10 text-5xl font-bold">
          My Profile
        </h1>

        <div className="space-y-8">

          <div>
            <p className="text-gray-500">Full Name</p>
            <h2 className="text-3xl font-semibold">
              {user?.fullName}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">Username</p>
            <h2 className="text-2xl">
              {user?.username}
            </h2>
          </div>

          <div>
            <p className="text-gray-500">Email</p>
            <h2 className="text-2xl">
              {user?.email}
            </h2>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Profile;