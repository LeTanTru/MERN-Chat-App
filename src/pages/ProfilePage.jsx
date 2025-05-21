import { useAuthStore } from '@/store/useAuthStore';
import { Camera, Mail, User } from 'lucide-react';
import { useState } from 'react';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className='h-screen pt-20'>
      <div className='mx-auto max-w-2xl p-4 py-8'>
        <div className='bg-base-300 space-y-8 rounded-xl p-6'>
          <div className='text-center'>
            <h1 className='text-2xl font-semibold'>Profile</h1>
            <p className='mt-2'>Your profile information</p>
          </div>

          <div className='flex flex-col items-center gap-4'>
            <div className='relative'>
              <img
                src={previewImage || authUser.profilePic || '/avatar.png'}
                alt='Profile picture'
                className='size-32 rounded-full border-4 object-cover'
              />
              <label
                htmlFor='avatar-upload'
                className={`bg-base-content absolute right-0 bottom-0 cursor-pointer rounded-full p-2 transition-all duration-200 hover:scale-105 ${isUpdatingProfile ? 'pointer-events-none animate-pulse' : ''}`}
              >
                <Camera className='text-base-200 size-5' />
                <input
                  type='file'
                  id='avatar-upload'
                  accept='image/*'
                  className='hidden'
                  disabled={isUpdatingProfile}
                  onChange={handleImageChange}
                />
              </label>
            </div>
            <p className='text-sm text-zinc-400'>
              {isUpdatingProfile
                ? 'Uploading...'
                : 'Click the camera icon to upload a new profile picture'}
            </p>
          </div>

          <div className='space-y-6'>
            <div className='space-y-1.5'>
              <div className='text-md ml-1 flex items-center gap-1 text-zinc-400'>
                <User className='size-6' />
                <span className='font-semibold'>Full name:</span>
              </div>
              <p className='bg-base-200 rounded-lg border px-4 py-2.5'>
                {authUser?.fullName}
              </p>
            </div>

            <div className='space-y-1.5'>
              <div className='text-md ml-1 flex items-center gap-1 text-zinc-400'>
                <Mail className='size-6' />
                <span className='font-semibold'>Email:</span>
              </div>
              <p className='bg-base-200 rounded-lg border px-4 py-2.5'>
                {authUser?.email}
              </p>
            </div>

            <div className='bg-base-300 mt-6 rounded-xl p-6'>
              <h2 className='mb-4 text-lg font-medium'>Account Information</h2>
              <div className='text-sm'>
                <div className='flex items-center justify-between border-b border-zinc-700 py-2'>
                  <span>Member since</span>
                  <span>{authUser?.createdAt?.split('T')[0]}</span>
                </div>
                <div className='flex items-center justify-between py-2'>
                  <span>Account Status</span>
                  <span className='text-green-500'>Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
