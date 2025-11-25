import React from 'react';
import { Project } from '../types';
import { Layers, Cpu, Code, Globe } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
    onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
    const getIcon = () => {
        switch(project.category) {
            case 'Robotics': return <Cpu className="text-accent" />;
            case 'Software': return <Code className="text-primary" />;
            case 'IoT': return <Globe className="text-green-400" />;
            default: return <Layers className="text-yellow-400" />;
        }
    }

    return (
        <div 
            onClick={onClick}
            className="group relative bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 cursor-pointer hover:shadow-[0_0_30px_rgba(14,165,233,0.15)] hover:-translate-y-1"
        >
            <div className="aspect-video w-full overflow-hidden">
                <img 
                    src={project.imageUrl} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-80" />
                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur border border-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                    {getIcon()}
                    <span className="text-xs font-bold tracking-wider text-white uppercase">{project.category}</span>
                </div>
            </div>
            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{project.title}</h3>
                <p className="text-white/60 text-sm mb-4 line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                    <span className="text-xs text-white/40">Tác giả</span>
                    <span className="text-sm text-primary font-medium">{project.authors}</span>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;