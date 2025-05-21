import { useChatStore } from '@/store/useChatStore';
import { Image, Send, X } from 'lucide-react';
import { useRef, useState } from 'react';

const MessageInput = () => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    fileInputRef.current.value = null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview
      });
      setText('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className='w-full p-4'>
      {imagePreview && (
        <div className='mb-3 flex items-center gap-2'>
          <div className='relative'>
            <img
              src={imagePreview}
              alt='Preview'
              className='h-20 w-20 rounded-lg border border-zinc-700 object-cover'
            />
            <button
              onClick={removeImage}
              className='bg-base-300 absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full'
              type='button'
            >
              <X className='size-3' />
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
        <div className='flex flex-1 gap-2'>
          <input
            type='text'
            className='input input-bordered input-sm sm:input-md w-full rounded-lg'
            placeholder='Type a message...'
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type='file'
            accept='image/*'
            className='hidden'
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type='button'
            className={`btn btn-circle hidden sm:flex ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          className='btn btn-circle cursor-pointer'
          type='submit'
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
