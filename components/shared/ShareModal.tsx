import React from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';

interface ShareModalProps {
    title: string;
    shareText: string;
    shareUrl: string;
    onClose: () => void;
}

const SocialLink: React.FC<{ href: string; children: React.ReactNode; platform: string }> = ({ href, children, platform }) => {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex flex-col items-center justify-center p-6 space-y-2 rounded-lg bg-background-dark hover:bg-gray-800 transition-colors text-center ${platform}`}
            aria-label={`Share on ${platform}`}
        >
            {children}
        </a>
    );
};

export const ShareModal: React.FC<ShareModalProps> = ({ title, shareText, shareUrl, onClose }) => {
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(shareUrl);

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}&hashtags=EduPlannerDSA,LearnToCode`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`;
    const linkedinUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodeURIComponent(title)}&summary=${encodedText}`;

    return (
        <Modal title={title} onClose={onClose}>
            <div className="space-y-4">
                 <p className="text-sm text-center text-text-secondary">Share this achievement with your network!</p>
                <div className="grid grid-cols-3 gap-4">
                    <SocialLink href={twitterUrl} platform="twitter">
                        <Icon name="twitter" className="h-8 w-8 text-blue-400" />
                        <span className="text-sm font-medium text-text-primary">Twitter</span>
                    </SocialLink>
                    <SocialLink href={facebookUrl} platform="facebook">
                        <Icon name="facebook" className="h-8 w-8 text-blue-600" />
                        <span className="text-sm font-medium text-text-primary">Facebook</span>
                    </SocialLink>
                    <SocialLink href={linkedinUrl} platform="linkedin">
                        <Icon name="linkedin" className="h-8 w-8 text-blue-500" />
                        <span className="text-sm font-medium text-text-primary">LinkedIn</span>
                    </SocialLink>
                </div>
            </div>
        </Modal>
    );
};