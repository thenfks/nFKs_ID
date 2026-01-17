import { User, Camera, Loader2 } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../../../lib/supabase';
import { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { DatePicker } from '../../../components/ui/DatePicker';

interface PersonalInfoProps {
    user: SupabaseUser | null;
}

interface UserProfile {
    id: string;
    avatar_url: string | null;
    full_name: string | null;
    profession: string | null;
    height: string | null;
    weight: string | null;
    recovery_email: string | null;
    recovery_phone: string | null;
    languages: string | null;
    home_address: string | null;
    work_address: string | null;
    phone: string | null;
    birthday: string | null;
    gender: string | null;
}

export function PersonalInfo({ user }: PersonalInfoProps) {
    const { toast } = useToast();
    const [profile, setProfile] = useState<UserProfile>({
        id: user?.id || '',
        avatar_url: null,
        full_name: '',
        profession: '',
        height: '',
        weight: '',
        recovery_email: '',
        recovery_phone: '',
        languages: '',
        home_address: '',
        work_address: '',
        phone: '',
        birthday: '',
        gender: ''
    });
    const [uploading, setUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const email = user?.email || 'user@example.com';
    const photoUrl = profile.avatar_url || user?.user_metadata?.avatar_url || null;
    const initial = profile.full_name && profile.full_name !== 'nFKs User' ? profile.full_name[0].toUpperCase() : (user?.email ? user.email[0].toUpperCase() : 'M');

    useEffect(() => {
        if (user) {
            getProfile();
        }
    }, [user]);

    async function getProfile() {
        try {
            const { data } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', user!.id)
                .single();

            if (data) {
                setProfile(data);
            } else {
                // Initialize with auth metadata if no profile exists
                setProfile(prev => ({
                    ...prev,
                    id: user!.id,
                    full_name: user?.user_metadata?.full_name || user?.user_metadata?.name || '',
                    avatar_url: user?.user_metadata?.avatar_url || null
                }));
            }
        } catch (error) {
            console.log('Error loading user data!');
        }
    }

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!event.target.files || event.target.files.length === 0) {
                throw new Error('You must select an image to upload.');
            }

            const file = event.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${user!.id}/${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);

            const updates = {
                id: user!.id,
                avatar_url: publicUrl,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('user_profiles').upsert(updates);

            if (error) throw error;

            const { error: authError } = await supabase.auth.updateUser({
                data: { avatar_url: publicUrl }
            });

            if (authError) console.warn('Failed to sync auth metadata:', authError);

            setProfile((prev) => ({ ...prev, avatar_url: publicUrl }));

            toast({
                title: "Avatar updated",
                description: "Your profile picture has been updated.",
                variant: 'success',
            });
        } catch (error) {
            console.error(error);
            toast({
                title: "Upload failed",
                description: "Failed to upload avatar. Please try again.",
                variant: 'destructive',
            });
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (field: keyof UserProfile, value: string) => {
        setProfile(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (!user) return;
        setSaving(true);
        try {
            const updates = {
                ...profile,
                id: user.id,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase.from('user_profiles').upsert(updates);
            if (error) throw error;

            // Sync Name with Auth Meta if changed
            if (profile.full_name !== user.user_metadata.full_name) {
                await supabase.auth.updateUser({
                    data: { full_name: profile.full_name }
                });
            }

            toast({
                title: "Profile updated",
                description: "Your personal info has been saved.",
                variant: 'success',
            });

        } catch (error) {
            console.error('Error updating profile:', error);
            toast({
                title: "Update failed",
                description: "Could not save changes. Please try again.",
                variant: 'destructive',
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex-1 px-8 pt-10 pb-10 flex flex-col items-center animate-in fade-in duration-500 relative">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploading}
            />

            <div className="w-full max-w-2xl">
                <div className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl font-normal text-white mb-4">Personal info</h1>
                    <p className="text-zinc-400 text-lg leading-relaxed">
                        Info about you and your preferences across nFKs services.
                    </p>
                    <div className="mt-4 p-4 bg-[#1E1E1E]/50 border border-zinc-800 rounded-xl flex items-start gap-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 mt-1">
                            <User size={20} />
                        </div>
                        <div>
                            <h3 className="text-white font-medium mb-1">Your profile info in nFKs services</h3>
                            <p className="text-sm text-zinc-400">
                                Personal info and options to manage it. You can make some of this info, like your contact details, visible to others so they can reach you easily. You can also see a summary of your profiles.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- BASIC INFO --- */}
                <div className="border border-zinc-800 rounded-2xl bg-[#1E1E1E]/30">
                    <div className="p-6 border-b border-zinc-800">
                        <h2 className="text-xl text-white font-normal">Basic info</h2>
                        <p className="text-zinc-500 text-sm mt-1">Some info may be visible to other people using nFKs services.</p>
                    </div>

                    {/* Profile Picture Row */}
                    <div
                        className="flex flex-col items-center justify-center p-6 hover:bg-zinc-800/30 transition-colors cursor-pointer border-b border-zinc-800"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <div className="relative mb-4 group">
                            <div className="w-24 h-24 rounded-full bg-purple-600 text-white flex items-center justify-center text-3xl font-medium overflow-hidden">
                                {uploading ? (
                                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                                ) : photoUrl ? (
                                    <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    initial
                                )}
                            </div>
                            <div className="absolute bottom-0 right-0 bg-[#202124] p-2 rounded-full border border-black shadow-lg hover:bg-zinc-700 transition-colors">
                                <Camera size={16} className="text-white" />
                            </div>
                        </div>
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Profile picture</div>
                    </div>

                    {/* Name Row */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Name</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add name"
                            value={profile.full_name || ''}
                            onChange={(e) => handleChange('full_name', e.target.value)}
                        />
                    </div>

                    {/* Birthday Row */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Birthday</div>
                        <div className="flex-1">
                            <DatePicker
                                value={profile.birthday}
                                onChange={(date) => handleChange('birthday', date)}
                                placeholder="Add birthday"
                            />
                        </div>
                    </div>

                    {/* Gender Row */}
                    <div className="flex items-center justify-between p-6">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Gender</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add gender"
                            value={profile.gender || ''}
                            onChange={(e) => handleChange('gender', e.target.value)}
                        />
                    </div>
                </div>

                {/* --- CONTACT INFO --- */}
                <div className="mt-8 border border-zinc-800 rounded-2xl overflow-hidden bg-[#1E1E1E]/30 mb-8">
                    <div className="p-6 border-b border-zinc-800">
                        <h2 className="text-xl text-white font-normal">Contact info</h2>
                    </div>

                    {/* Email Row (Read Only) */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Email</div>
                        <div className="flex-1 text-white font-medium">
                            {email}
                            <div className="text-xs text-zinc-500 mt-0.5">Primary email used for nFKs ID</div>
                        </div>
                    </div>

                    {/* Phone Row */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Phone</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add phone number"
                            value={profile.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                        />
                    </div>

                    {/* Home Address Row */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Home</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add home address"
                            value={profile.home_address || ''}
                            onChange={(e) => handleChange('home_address', e.target.value)}
                        />
                    </div>

                    {/* Work Address Row */}
                    <div className="flex items-center justify-between p-6">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Work</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add work address"
                            value={profile.work_address || ''}
                            onChange={(e) => handleChange('work_address', e.target.value)}
                        />
                    </div>
                </div>

                {/* --- ADVANCED INFO --- */}
                <div className="mt-8 border border-zinc-800 rounded-2xl overflow-hidden bg-[#1E1E1E]/30 mb-8">
                    <div className="p-6 border-b border-zinc-800">
                        <h2 className="text-xl text-white font-normal">Advanced info</h2>
                    </div>

                    {/* Recovery Email Row */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Recovery Email</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add recovery email"
                            value={profile.recovery_email || ''}
                            onChange={(e) => handleChange('recovery_email', e.target.value)}
                        />
                    </div>

                    {/* Recovery Phone Row */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Recovery Phone</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add recovery phone"
                            value={profile.recovery_phone || ''}
                            onChange={(e) => handleChange('recovery_phone', e.target.value)}
                        />
                    </div>

                    {/* Profession Row */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Profession</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add profession"
                            value={profile.profession || ''}
                            onChange={(e) => handleChange('profession', e.target.value)}
                        />
                    </div>

                    {/* Height Row */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Height</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add height"
                            value={profile.height || ''}
                            onChange={(e) => handleChange('height', e.target.value)}
                        />
                    </div>

                    {/* Weight Row */}
                    <div className="flex items-center justify-between p-6 border-b border-zinc-800">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Weight</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add weight"
                            value={profile.weight || ''}
                            onChange={(e) => handleChange('weight', e.target.value)}
                        />
                    </div>

                    {/* Languages Row */}
                    <div className="flex items-center justify-between p-6">
                        <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider w-32 shrink-0">Languages</div>
                        <input
                            type="text"
                            className="flex-1 bg-transparent text-white font-medium focus:outline-none placeholder:text-zinc-600"
                            placeholder="Add languages"
                            value={profile.languages || ''}
                            onChange={(e) => handleChange('languages', e.target.value)}
                        />
                    </div>
                </div>

                {/* SAVE BUTTON */}
                <div className="flex justify-end mb-20">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black text-white px-10 py-3 rounded-full font-medium hover:bg-zinc-900 transition-all shadow-xl border border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : 'Save changes'}
                    </button>
                </div>

            </div>
        </div>
    );
}
