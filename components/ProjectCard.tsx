import React from 'react';
import { Project } from '../types';
import { Leaf, Cpu, Monitor, Calculator, Layers, FlaskConical, BookOpen } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    const getIcon = () => {
        switch(project.category) {
            case 'Environment': return <Leaf className="text-green-400" />;
            case 'Technology': return <Cpu className="text-blue-400" />;
            case 'IT': return <Monitor className="text-purple-400" />;
            case 'Math': return <Calculator className="text-yellow-400" />;
            case 'NaturalScience': return <FlaskConical className="text-pink-400" />;
            case 'SocialScience': return <BookOpen className="text-orange-400" />;
            default: return <Layers className="text-white" />;
        }
    }

    const getCategoryLabel = () => {
         switch(project.category) {
            case 'Environment': return 'Môi trường';
            case 'Technology': return 'Công nghệ';
            case 'IT': return 'Tin học';
            case 'Math': return 'Toán học';
            case 'NaturalScience': return 'KHTN';
            case 'SocialScience': return 'KHXH';
            default: return project.category;
        }
    }

    return (
        <div 
            onClick={onClick}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] hover:-translate-y-1"
        >
            <div className="aspect-video w-full overflow-hidden relative">
                <img 
                    src={project.coverImage} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-80" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                    {getIcon()}
                    <span className="text-xs font-bold tracking-wider text-white uppercase">{getCategoryLabel()}</span>
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs text-white/40">Tác giả</span>
                    <span className="text-sm text-primary font-medium line-clamp-1 text-right pl-2">{project.authors}</span>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;