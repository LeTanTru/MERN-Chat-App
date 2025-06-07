import { useAuthStore } from '@/store/useAuthStore';
import { Camera, Mail, User } from 'lucide-react';
import { useState } from 'react';
import cn from 'classnames';

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, uploadImage, updateProfile } =
    useAuthStore();
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(authUser);
  const [image, setImage] = useState(authUser?.profilePic);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      if (selectedFile) {
        const res = await uploadImage(selectedFile);
        setImage(res?.url);
      }

      await updateProfile({ ...user, profilePic: image?.url });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSelectedFile(null);
      setPreviewImage(null);
      setIsEditing(false);
    } finally {
      setSelectedFile(null);
      setPreviewImage(null);
      setIsEditing(false);
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
              {isEditing && (
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
              )}
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
              <input
                type='text'
                className={cn(
                  'bg-base-200 block w-full rounded-lg border-2 p-2.5 text-sm transition-all duration-300 ease-linear focus:border-blue-500 focus:ring-blue-500',
                  {
                    'cursor-not-allowed border-gray-500 text-gray-500':
                      !isEditing,
                    'text-white': isEditing
                  }
                )}
                onChange={(e) => setUser({ ...user, fullName: e.target.value })}
                required
                value={user?.fullName || ''}
                placeholder='First name'
                disabled={!isEditing}
              />
            </div>

            <div className='space-y-1.5'>
              <div className='text-md ml-1 flex items-center gap-1 text-zinc-400'>
                <Mail className='size-6' />
                <span className='font-semibold'>Email:</span>
              </div>
              <input
                type='email'
                className={cn(
                  'bg-base-200 block w-full rounded-lg border-2 p-2.5 text-sm transition-all duration-300 ease-linear focus:border-blue-500 focus:ring-blue-500',
                  {
                    'cursor-not-allowed border-gray-500 text-gray-500':
                      !isEditing,
                    'text-white': isEditing
                  }
                )}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
                value={user?.email || ''}
                placeholder='Email'
                disabled={!isEditing}
              />
            </div>

            <div className='bg-base-300 rounded-xl p-6 pt-0'>
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

            <div className='flex justify-end gap-x-3'>
              <button
                className='btn btn btn-soft transition-all duration-200 ease-linear hover:opacity-85'
                onClick={() => setIsEditing(false)}
                disabled={isUpdatingProfile}
              >
                Cancel
              </button>
              {!isEditing ? (
                <button
                  className='btn btn-primary transition-all duration-200 ease-linear hover:opacity-85'
                  onClick={() => setIsEditing(true)}
                  disabled={isUpdatingProfile}
                >
                  Edit profile
                </button>
              ) : (
                <button
                  className='btn btn-primary transition-all duration-200 ease-linear hover:opacity-85'
                  onClick={handleUpdateProfile}
                  disabled={!isEditing || isUpdatingProfile}
                >
                  {isUpdatingProfile && (
                    <span className='loading loading-spinner'></span>
                  )}
                  Update profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
